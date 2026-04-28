using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PermissionsDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTOs;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IPermissionService
    {
        Task<ResponseDataModel<PermissionDto>> CreatePermissionAsync(CreatePermissionDto dto, CancellationToken cancellationToken);
        Task<ResponseDataModel<List<PermissionDto>>> GetAllPermissionsAsync(CancellationToken cancellationToken);
        Task<ResponseDataModel<PermissionDto>> GetPermissionByIdAsync(int id, CancellationToken cancellationToken);
        Task<ResponseDataModel<PermissionDto>> UpdatePermissionAsync(int id, UpdatePermissionDto dto, CancellationToken cancellationToken);
        Task<ResponseDataModel<bool>> DeletePermissionAsync(int id, CancellationToken cancellationToken);
    }
}