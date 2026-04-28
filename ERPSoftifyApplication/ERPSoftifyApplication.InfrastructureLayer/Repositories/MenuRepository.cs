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
    public class MenuRepository:IMenuInterface
    {
        private readonly DataContext _context;

        public MenuRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Menu> CreateAsync(Menu Menu, CancellationToken cancellationToken)
        {
            await _context.Menus.AddAsync(Menu, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return Menu;
        }

        public async Task<Menu?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Menus
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public async Task<List<Menu>> GetAllAsync(CancellationToken cancellationToken)
        {
            try
            {
                return await _context.Menus
               .AsNoTracking().Include(x => x.Parent)
               .ToListAsync(cancellationToken);
            }
            catch (Exception e)
            {

                throw;
            }
        }

        public async Task<Menu> UpdateAsync(Menu Menu, CancellationToken cancellationToken)
        {
            _context.Menus.Update(Menu);
            await _context.SaveChangesAsync(cancellationToken);

            return Menu;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var entity = await _context.Menus
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

            if (entity == null)
                return false;

            _context.Menus.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
        public async Task<List<Menu>> GetMenusByRoleIdAsync(int roleId, CancellationToken cancellationToken)
        {
            // Professional approach: Join specifically what you need
            var query = from rm in _context.RoleMenus
                        join m in _context.Menus.Include(x => x.Parent) on rm.MenuId equals m.Id
                        where rm.RoleId == roleId && m.IsActive
                        select m;

            var menuList = await query
         .AsNoTracking()
         .ToListAsync(cancellationToken);

            return menuList;
        }


    }
}

