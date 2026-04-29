using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IRoleMenuPermissionInterface
    {
        Task<RoleMenu> CreateAsync(RoleMenu Menu, CancellationToken cancellationToken);
        Task SaveRoleMenusAsync(List<RoleMenu> roleMenus, int roleId, CancellationToken ct);
        Task<RoleMenu?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<List<RoleMenu>> GetRoleMenusOnlyAsync(int roleId, CancellationToken ct);
        Task<List<RoleMenu>> GetMenusByRoleIdAsync(int roleId, CancellationToken ct);
        Task<List<RoleMenu>> GetAllAsync(CancellationToken cancellationToken);
        Task DeleteRangeAsync(List<RoleMenu> items, CancellationToken ct);
        Task CreateRangeAsync(List<RoleMenu> items, CancellationToken ct);
        Task<RoleMenu> UpdateAsync(RoleMenu Menu, CancellationToken cancellationToken);

        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
        
    }
}
