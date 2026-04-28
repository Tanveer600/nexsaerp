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
    public class TenantRepository:ITenantInterface
    {
        private readonly DataContext _context;

        public TenantRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<TenantSetting> CreateAsync(TenantSetting TenantSetting, CancellationToken cancellationToken)
        {
            await _context.TenantSettings.AddAsync(TenantSetting, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return TenantSetting;
        }

        public async Task<TenantSetting?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.TenantSettings
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);
        }

        public async Task<List<TenantSetting>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.TenantSettings
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<TenantSetting> UpdateAsync(TenantSetting TenantSetting, CancellationToken cancellationToken)
        {
            _context.TenantSettings.Update(TenantSetting);
            await _context.SaveChangesAsync(cancellationToken);

            return TenantSetting;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var entity = await _context.TenantSettings
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);

            if (entity == null)
                return false;

            _context.TenantSettings.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}

