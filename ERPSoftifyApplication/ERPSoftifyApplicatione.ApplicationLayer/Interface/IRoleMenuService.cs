using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IRoleMenuService
    {
        Task AssignMenusAsync(int roleId, List<int> menuIds, CancellationToken cancellationToken);

        Task<List<Menu>> GetMenusByRoleAsync(int roleId, CancellationToken cancellationToken);

        Task RemoveMenuAsync(int roleId, int menuId, CancellationToken cancellationToken);

        Task<List<RoleMenu>> GetAllAsync(CancellationToken cancellationToken);
    }
}
