using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PermissionsDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTOs;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly IPermissionInterface _permissionRepository;

        public PermissionService(IPermissionInterface permissionRepository)
        {
            _permissionRepository = permissionRepository;
        }

        public async Task<ResponseDataModel<PermissionDto>> CreatePermissionAsync(CreatePermissionDto dto, CancellationToken cancellationToken)
        {
            var permission = new Permission
            {
                PermissionName = dto.PermissionName,
                Description = dto.Description,
                TenantId = dto.TenantId,
                CanView = dto.CanView,
                CanAdd = dto.CanAdd,
                CanUpdate = dto.CanUpdate,
                CanDelete = dto.CanDelete,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _permissionRepository.CreateAsync(permission, cancellationToken);

            return ResponseDataModel<PermissionDto>.SuccessResponse(MapToDto(result), "Permission created successfully");
        }

        public async Task<ResponseDataModel<List<PermissionDto>>> GetAllPermissionsAsync(CancellationToken cancellationToken)
        {
            var result = await _permissionRepository.GetAllAsync(cancellationToken);
            var dtoList = result.Select(MapToDto).ToList();
            return ResponseDataModel<List<PermissionDto>>.SuccessResponse(dtoList);
        }

        public async Task<ResponseDataModel<PermissionDto>> GetPermissionByIdAsync(int id, CancellationToken cancellationToken)
        {
            var permission = await _permissionRepository.GetByIdAsync(id, cancellationToken);
            if (permission == null)
                return ResponseDataModel<PermissionDto>.FailureResponse("Permission not found");

            return ResponseDataModel<PermissionDto>.SuccessResponse(MapToDto(permission));
        }

        public async Task<ResponseDataModel<PermissionDto>> UpdatePermissionAsync(int id, UpdatePermissionDto dto, CancellationToken cancellationToken)
        {
            var existing = await _permissionRepository.GetByIdAsync(id, cancellationToken);
            if (existing == null)
                return ResponseDataModel<PermissionDto>.FailureResponse("Permission not found");

            existing.PermissionName = dto.PermissionName;
            existing.Description = dto.Description;
            existing.CanView = dto.CanView;
            existing.CanAdd = dto.CanAdd;
            existing.CanUpdate = dto.CanUpdate;
            existing.CanDelete = dto.CanDelete;
            existing.UpdatedAt = DateTime.UtcNow;

            var updated = await _permissionRepository.UpdateAsync(existing, cancellationToken);

            return ResponseDataModel<PermissionDto>.SuccessResponse(MapToDto(updated), "Permission updated successfully");
        }

        public async Task<ResponseDataModel<bool>> DeletePermissionAsync(int id, CancellationToken cancellationToken)
        {
            var exists = await _permissionRepository.GetByIdAsync(id, cancellationToken);
            if (exists == null)
                return ResponseDataModel<bool>.FailureResponse("Permission not found");

            var deleted = await _permissionRepository.DeleteAsync(id, cancellationToken);
            return ResponseDataModel<bool>.SuccessResponse(deleted, "Permission deleted successfully");
        }

        // Helper: Entity → DTO mapping
        private PermissionDto MapToDto(Permission permission)
        {
            return new PermissionDto
            {
                Id = permission.ID,
                PermissionName = permission.PermissionName,
                Description = permission.Description,
                TenantId = permission.TenantId,
                CanView = permission.CanView,
                CanAdd = permission.CanAdd,
                CanUpdate = permission.CanUpdate,
                CanDelete = permission.CanDelete
            };
        }
    }
}