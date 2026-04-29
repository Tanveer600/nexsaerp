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
    public class RoleMenuPermissionRepository : IRoleMenuPermissionInterface
    {
        private readonly DataContext _context;

        public RoleMenuPermissionRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<RoleMenu> CreateAsync(RoleMenu Menu, CancellationToken cancellationToken)
        {
            await _context.RoleMenus.AddAsync(Menu, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return Menu;
        }
        public async Task SaveRoleMenusAsync(List<RoleMenu> roleMenus, int roleId, CancellationToken ct)
        {
            var existing = await _context.RoleMenus
                .Where(x => x.RoleId == roleId)
                .ToListAsync(ct);

            if (existing.Any()) _context.RoleMenus.RemoveRange(existing);

            await _context.RoleMenus.AddRangeAsync(roleMenus, ct);
            await _context.SaveChangesAsync(ct);
        }
        public async Task<RoleMenu?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.RoleMenus
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);
        }

        public async Task<List<RoleMenu>> GetAllAsync(CancellationToken cancellationToken)
        {
            try
            {
                return await _context.RoleMenus
               .AsNoTracking()
               .ToListAsync(cancellationToken);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<RoleMenu> UpdateAsync(RoleMenu Menu, CancellationToken cancellationToken)
        {
            _context.RoleMenus.Update(Menu);
            await _context.SaveChangesAsync(cancellationToken);

            return Menu;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var entity = await _context.RoleMenus
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);

            if (entity == null)
                return false;

            _context.RoleMenus.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
        public async Task<List<RoleMenu>> GetMenusByRoleIdAsync(int roleId, CancellationToken ct)
        {

            return await _context.RoleMenus
                      .Include(x => x.Menu)
                  .Include(x => x.Permission)
                 .Where(x => x.RoleId == roleId)
                .ToListAsync(ct);
        }


    }
}
