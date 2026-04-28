using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplication.InfrastructureLayer;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.InfrastructureLayer.Repositories
{
  
public class RoleMenuRepository : IRoleMenuInterface
{
    private readonly DataContext _context;

    public RoleMenuRepository(DataContext context)
    {
        _context = context;
    }

    public async Task AssignMenusAsync(int roleId, List<int> menuIds, CancellationToken cancellationToken)
    {
        var existing = _context.RoleMenus.Where(rm => rm.RoleId == roleId);
        _context.RoleMenus.RemoveRange(existing);

        var newPermissions = menuIds.Select(menuId => new RoleMenu
        {
            RoleId = roleId,
            MenuId = menuId
        });

        await _context.RoleMenus.AddRangeAsync(newPermissions, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<Menu>> GetMenusByRoleAsync(int roleId, CancellationToken cancellationToken)
    {
        return await _context.RoleMenus
            .Where(rm => rm.RoleId == roleId)
            .Select(rm => rm.Menu)
            .Include(m => m.Children)
            .ToListAsync(cancellationToken);
    }

    public async Task RemoveMenuAsync(int roleId, int menuId, CancellationToken cancellationToken)
    {
        var entity = await _context.RoleMenus
            .FirstOrDefaultAsync(rm => rm.RoleId == roleId && rm.MenuId == menuId, cancellationToken);

        if (entity != null)
        {
            _context.RoleMenus.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<List<RoleMenu>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.RoleMenus
            .Include(rm => rm.Role)
            .Include(rm => rm.Menu)
            .ToListAsync(cancellationToken);
    }
}
}
