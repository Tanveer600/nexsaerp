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
    public class EmailRepository:IEmailInterfcae
    {
        private readonly DataContext _context;
        public EmailRepository(DataContext context) => _context = context;

        public async Task AddEmailAsync(UserEmail email, CancellationToken ct)
        {
            await _context.UserEmails.AddAsync(email, ct);
        }

        public async Task<bool> EmailExistsAsync(string subject, DateTime receivedDate, int tenantId, CancellationToken ct)
        {
            return await _context.UserEmails.AnyAsync(x =>
                x.Subject == subject &&
                x.ReceivedDate == receivedDate &&
                x.TenantId == tenantId, ct);
        }

        public async Task<List<UserEmail>> GetEmailsByTenantAsync(int tenantId, CancellationToken ct)
        {
            return await _context.UserEmails
                .Where(x => x.TenantId == tenantId)
                .OrderByDescending(x => x.ReceivedDate)
                .ToListAsync(ct);
        }

        public async Task SaveChangesAsync(CancellationToken ct)
        {
            await _context.SaveChangesAsync(ct);
        }
    }
}
