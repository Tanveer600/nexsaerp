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
    public class PermissionRepository:IPermissionInterface
    {
        private readonly DataContext _context;

        public PermissionRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Permission> CreateAsync(Permission permission,CancellationToken cancellationToken)
        {
            await _context.Permissions.AddAsync(permission, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return permission;
        }

        public async Task<Permission?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Permissions
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);
        }

        public async Task<List<Permission>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Permissions
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<Permission> UpdateAsync( Permission permission, CancellationToken cancellationToken)
        {
            _context.Permissions.Update(permission);
            await _context.SaveChangesAsync(cancellationToken);

            return permission;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var entity = await _context.Permissions
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);

            if (entity == null)
                return false;

            _context.Permissions.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
