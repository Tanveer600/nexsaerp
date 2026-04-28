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
    public class RoleRepository:IRoleInterface
    {
        private readonly DataContext _context;

        public RoleRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Role> CreateAsync(Role Role, CancellationToken cancellationToken)
        {
            await _context.Roles.AddAsync(Role, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return Role;
        }

        public async Task<Role?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);
        }

        public async Task<List<Role>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Roles
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<Role> UpdateAsync(Role Role, CancellationToken cancellationToken)
        {
            _context.Roles.Update(Role);
            await _context.SaveChangesAsync(cancellationToken);

            return Role;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var entity = await _context.Roles
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);

            if (entity == null)
                return false;

            _context.Roles.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
