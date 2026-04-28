using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.MenuDtos;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class MenuService : IMenuService
    {
        private readonly IMenuInterface _repoInterface;
        private readonly ICurrentUserService _currentUserService;
        public MenuService(IMenuInterface repoInterface, ICurrentUserService currentUserService)
        {
            _repoInterface = repoInterface;
            _currentUserService = currentUserService;
        }

        // 1. CREATE
        public async Task<ResponseDataModel<MenuDto>> CreateMenuAsync(CreateMenuDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var menuEntity = new Menu
                {
                    Title = dto.Title,
                    Url = dto.Url,
                    Icon = dto.Icon,
                    TenantId = dto.TenantId,
                    ParentId = dto.ParentId,
                    IsActive = dto.IsActive
                };
                
                var result = await _repoInterface.CreateAsync(menuEntity, cancellationToken);
                return ResponseDataModel<MenuDto>.SuccessResponse(MapToDto(result), "Menu created successfully");
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        // 2. GET ALL (Using .Select with Helper)
        public async Task<ResponseDataModel<List<MenuDto>>> GetAllMenusAsync(CancellationToken cancellationToken)
        {
            var result = await _repoInterface.GetAllAsync(cancellationToken);

            if (result == null || !result.Any())
                return ResponseDataModel<List<MenuDto>>.SuccessResponse(new List<MenuDto>(), "No records found");

            // BEST PRACTICE: Sab items ko helper method ke zariye map kiya
            var dtoList = result.Select(m => MapToDto(m)).ToList();

            return ResponseDataModel<List<MenuDto>>.SuccessResponse(dtoList);
        }

        // 3. GET BY ID
        public async Task<ResponseDataModel<MenuDto>> GetMenuByIdAsync(int id, CancellationToken cancellationToken)
        {
            var menuEntity = await _repoInterface.GetByIdAsync(id, cancellationToken);

            if (menuEntity == null)
                return ResponseDataModel<MenuDto>.FailureResponse("Menu not found");

            return ResponseDataModel<MenuDto>.SuccessResponse(MapToDto(menuEntity));
        }

        public async Task<ResponseDataModel<UpdateMenuDto>> UpdateMenuAsync(UpdateMenuDto dto, CancellationToken cancellationToken)
        {
            var existing = await _repoInterface.GetByIdAsync(dto.Id, cancellationToken);
            if (existing == null)
                return ResponseDataModel<UpdateMenuDto>.FailureResponse("Menu not found");

            existing.Title = dto.Title;
            existing.Url = dto.Url;
            existing.Icon = dto.Icon;
            existing.ParentId = dto.ParentId;
            existing.IsActive = dto.IsActive;
            existing.TenantId = dto.TenantId;

            await _repoInterface.UpdateAsync(existing, cancellationToken);
            return ResponseDataModel<UpdateMenuDto>.SuccessResponse(dto, "Menu updated successfully");
        }

        // 5. DELETE
        public async Task<ResponseDataModel<bool>> DeleteMenuAsync(int id, CancellationToken cancellationToken)
        {
            var exists = await _repoInterface.GetByIdAsync(id, cancellationToken);
            if (exists == null)
                return ResponseDataModel<bool>.FailureResponse("Menu not found");

            var result = await _repoInterface.DeleteAsync(id, cancellationToken);
            return ResponseDataModel<bool>.SuccessResponse(result, "Menu deleted successfully");
        }

        private MenuDto MapToDto(Menu menu)
        {
            if (menu == null) return null;

            return new MenuDto
            {
                Id = menu.Id,
                Title = menu.Title,
                Url = menu.Url,
                Icon = menu.Icon,
                TenantId = menu.TenantId,
                IsActive = menu.IsActive,
                ParentId = menu.ParentId,
                ParentTitle = menu.Parent?.Title 
            };
        }

        public async Task<ResponseDataModel<List<MenuDto>>> GetMenusByRoleAsync(int roleId, CancellationToken cancellationToken)
        {
            try
            {
                var targetRoleId = roleId > 0 ? roleId : _currentUserService.RoleId;

                if (targetRoleId == 0)
                    return ResponseDataModel<List<MenuDto>>.FailureResponse("User role not identified");

                // 1. Repository se Flat List mangwayein
                var menuEntities = await _repoInterface.GetMenusByRoleIdAsync(targetRoleId, cancellationToken);

                if (menuEntities == null || !menuEntities.Any())
                    return ResponseDataModel<List<MenuDto>>.SuccessResponse(new List<MenuDto>());

                // 2. Pehle saari Entities ko Flat DTOs mein convert karein
                var allItems = menuEntities.Select(m => new MenuDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Url = m.Url,
                    Icon = m.Icon,
                    TenantId = m.TenantId,
                    IsActive = m.IsActive,
                    ParentId = m.ParentId,
                    ParentTitle = m.Parent?.Title
                }).ToList();

                // 3. TREE BUILDING LOGIC (Professional & Recursive)
                var menuTree = allItems
                    .Where(m => m.ParentId == null) // Sirf top-level (Main) menus uthaye
                    .Select(m => {
                        m.Children = GetChildren(allItems, m.Id); // Har menu ke bachay dhundo
                        return m;
                    }).ToList();

                return ResponseDataModel<List<MenuDto>>.SuccessResponse(menuTree);
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        // Helper method for Recursion
        private List<MenuDto> GetChildren(List<MenuDto> allItems, int parentId)
        {
            return allItems
                .Where(m => m.ParentId == parentId)
                .Select(m => {
                    m.Children = GetChildren(allItems, m.Id); // Ye line 3rd, 4th level tak bhi le jayegi
                    return m;
                }).ToList();
        }


    }
}