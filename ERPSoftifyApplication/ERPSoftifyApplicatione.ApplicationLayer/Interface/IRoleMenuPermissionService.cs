using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.MenuDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IRoleMenuPermissionService
    {
        // 1. Bulk Assignment (Create aur Update dono ke liye yahi kafi hai)
        Task<ResponseDataModel<string>> AssignRoleMenusAsync(AssignRoleMenusDto dto, CancellationToken ct);

        // 2. Role ke mutabiq menus lana (Sidebar ke liye aur Edit mode ke liye)
        Task<ResponseDataModel<List<MenuDto>>> GetMenusByRoleIdAsync(int roleId, CancellationToken cancellationToken);

        // 3. System mein kitni roles ko menus assigned hain (Admin Dashboard ke liye)
        Task<ResponseDataModel<List<RoleMenuDto>>> GetAllAssignedPermissionsAsync(CancellationToken cancellationToken);

        // 4. Kisi specific assignment ko remove karna
        Task<ResponseDataModel<bool>> DeleteRolePermissionAsync(int id, CancellationToken cancellationToken);
    }
}
