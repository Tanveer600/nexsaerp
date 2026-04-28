using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface ITenantService
    {
        Task<ResponseDataModel<TenantDto>> CreateTenantSettingAsync(CreateTenantDto dto, CancellationToken cancellationToken);

        Task<ResponseDataModel<List<TenantDto>>> GetAllTenantSettingsAsync(CancellationToken cancellationToken);

        Task<ResponseDataModel<TenantDto>> GetTenantSettingByIdAsync(int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<TenantDto>> UpdateTenantSettingAsync(int id, CreateTenantDto dto, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeleteTenantSettingAsync(int id, CancellationToken cancellationToken);
    }
}
