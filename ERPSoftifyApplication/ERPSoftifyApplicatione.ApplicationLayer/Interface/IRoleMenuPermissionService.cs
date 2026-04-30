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
        Task<ResponseDataModel<string>> AssignRoleMenusAsync(AssignRoleMenusDto dto, CancellationToken ct);
        Task<ResponseDataModel<List<MenuDto>>> GetMenusByRoleIdAsync(int roleId, CancellationToken cancellationToken);
        Task<ResponseDataModel<List<RoleMenuDto>>> GetAllAssignedPermissionsAsync(CancellationToken cancellationToken);
        Task<ResponseDataModel<bool>> DeleteRolePermissionAsync(int id, CancellationToken cancellationToken);
    }
}
