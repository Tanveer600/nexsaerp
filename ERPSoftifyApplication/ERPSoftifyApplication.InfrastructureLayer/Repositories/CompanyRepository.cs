using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.InfrastructureLayer.Repositories
{
    public class CompanyRepository:ICompanySettingInterface
    {
        private readonly DataContext _context;

        public CompanyRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<User?> GetUserProfileAsync(int userId, CancellationToken cancellationToken)
        {
            return await _context.Users
                .Where(u => u.ID == userId) 
                .FirstOrDefaultAsync(cancellationToken);
        }

        public async Task<User> SaveOrUpdateUserProfileAsync(User user, byte[]? profileImageBytes, string? profileImageFileName, CancellationToken cancellationToken)
        {
            var existing = await _context.Users
                .FirstOrDefaultAsync(u => u.ID == user.ID, cancellationToken);

            if (existing == null) throw new Exception("User not found");
            existing.Name = user.Name;
            existing.Email = user.Email;
            existing.PhoneNumber = user.PhoneNumber;
            existing.WebsiteUrl = user.WebsiteUrl;
            existing.UpdatedAt = DateTime.UtcNow;

            if (profileImageBytes != null && profileImageBytes.Length > 0)
            {
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profile");
                if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

                var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(profileImageFileName)}";
                var filePath = Path.Combine(folderPath, uniqueFileName);

                await File.WriteAllBytesAsync(filePath, profileImageBytes, cancellationToken);

                if (!string.IsNullOrEmpty(existing.ProfilePictureUrl))
                {
                    var oldPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", existing.ProfilePictureUrl.TrimStart('/'));
                    if (File.Exists(oldPath)) try { File.Delete(oldPath); } catch { }
                }

                existing.ProfilePictureUrl = $"/uploads/profile/{uniqueFileName}";
            }

            await _context.SaveChangesAsync(cancellationToken);
            return existing;
        }
        public async Task<CompanySetting> GetCompanySettingAsync(int companyId, CancellationToken cancellationToken)
        {
            return await _context.CompanySettings
                                 .FirstOrDefaultAsync(c => c.Id == companyId, cancellationToken)
                                 ?? throw new Exception("Company not found");
        }
        public async Task<List<CompanySetting>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.CompanySettings
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
        public async Task<CompanySetting> SaveOrUpdateCompanySettingAsync(CompanySetting company, CancellationToken cancellationToken)
        {
            var existingCompany = await _context.CompanySettings
                .FirstOrDefaultAsync(x => x.Id == company.Id, cancellationToken);

            if (existingCompany == null)
            {
                company.UpdatedAt = DateTime.UtcNow;
                await _context.CompanySettings.AddAsync(company, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
                return company;
            }
            _context.Entry(existingCompany).CurrentValues.SetValues(company);
            existingCompany.UpdatedAt = DateTime.UtcNow;
            _context.Entry(existingCompany).Collection(x => x.Users).IsModified = false;

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return existingCompany;
        }
    }
}
