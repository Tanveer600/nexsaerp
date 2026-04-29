using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.MenuDtos;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class RoleMenuPermissionService : IRoleMenuPermissionService
    {
        private readonly IRoleMenuPermissionInterface _repo;
        private readonly ICurrentUserService _currentUserService;
        public RoleMenuPermissionService(IRoleMenuPermissionInterface repo, ICurrentUserService currentUserService)
        {
            _repo = repo;
            _currentUserService = currentUserService;
        }
        public async Task<ResponseDataModel<string>> AssignRoleMenusAsync(AssignRoleMenusDto dto, CancellationToken ct)
        {
            try
            {
                if (dto == null || dto.MenuPermissions == null || !dto.MenuPermissions.Any())
                {
                    return ResponseDataModel<string>.FailureResponse("No permissions provided to assign.");
                }

                var currentDbPermissions = await _repo.GetMenusByRoleIdAsync(dto.RoleId, ct);

                if (currentDbPermissions != null && currentDbPermissions.Any())
                {
                    foreach (var record in currentDbPermissions)
                    {
                        await _repo.DeleteAsync(record.ID, ct);
                    }
                }

                foreach (var item in dto.MenuPermissions)
                {
                    if (item.PermissionId > 0)
                    {
                        var newEntry = new RoleMenu
                        {
                            RoleId = dto.RoleId,
                            MenuId = item.MenuId,
                            PermissionId = item.PermissionId,
                            TenantId = dto.TenantId
                        };

                        await _repo.CreateAsync(newEntry, ct);
                    }
                }

                return ResponseDataModel<string>.SuccessResponse("Permissions Updated Successfully!");
            }
            catch (Exception ex)
            {
                var errorMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return ResponseDataModel<string>.FailureResponse($"Error: {errorMsg}");
            }
        }
        public async Task<ResponseDataModel<List<MenuDto>>> GetMenusByRoleIdAsync(int roleId, CancellationToken ct)
        {

            var roleMenus = await _repo.GetMenusByRoleIdAsync(roleId, ct); 

            var allItems = roleMenus.Select(rm => new MenuDto
            {
                Id = rm.Menu.Id,
                Title = rm.Menu.Title, 
                Url = rm.Menu.Url,
                Icon = rm.Menu.Icon,
                ParentId = rm.Menu.ParentId,
                CanView = rm.Permission?.CanView ?? false,
                CanAdd = rm.Permission?.CanAdd ?? false,
                CanUpdate = rm.Permission?.CanUpdate ?? false,
                CanDelete = rm.Permission?.CanDelete ?? false
            }).ToList();

            var tree = allItems
                .Where(m => m.ParentId == null || m.ParentId == 0)
                .Select(m =>
                {
                    m.Children = GetChildren(allItems, m.Id);
                    return m;
                }).ToList();

            return ResponseDataModel<List<MenuDto>>.SuccessResponse(tree);
        }
        private List<MenuDto> GetChildren(List<MenuDto> items, int parentId)
        {
            return items
                .Where(x => x.ParentId == parentId)
                .Select(x =>
                {
                    x.Children = GetChildren(items, x.Id);
                    return x;
                })
                .ToList();
        }

        public async Task<ResponseDataModel<List<RoleMenuDto>>> GetAllAssignedPermissionsAsync(CancellationToken ct)
        {
            var data = await _repo.GetAllAsync(ct);
            var dtoList = data.Select(x => new RoleMenuDto
            {
                Id = x.ID,
                RoleId = x.RoleId,
                MenuId = x.MenuId,
                TenantId = x.TenantId
            }).ToList();

            return ResponseDataModel<List<RoleMenuDto>>.SuccessResponse(dtoList);
        }

        public async Task<ResponseDataModel<bool>> DeleteRolePermissionAsync(int id, CancellationToken ct)
        {
            var result = await _repo.DeleteAsync(id, ct);
            return result
                ? ResponseDataModel<bool>.SuccessResponse(true, "Deleted")
                : ResponseDataModel<bool>.FailureResponse("Not Found");
        }

    }
}