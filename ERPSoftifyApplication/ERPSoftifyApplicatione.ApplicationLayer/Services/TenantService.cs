using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class TenantService : ITenantService
    {
        private readonly ITenantInterface _tenantRepository;

        public TenantService(ITenantInterface tenantRepository)
        {
            _tenantRepository = tenantRepository;
        }

        // ================= CREATE =================
        public async Task<ResponseDataModel<TenantDto>> CreateTenantSettingAsync(
            CreateTenantDto dto,
            CancellationToken cancellationToken)
        {
            var entity = new TenantSetting
            {
                Name = dto.Name,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _tenantRepository.CreateAsync(entity, cancellationToken);

            var response = new TenantDto
            {
                Id = result.ID,
                Name = result.Name
            };

            return ResponseDataModel<TenantDto>
                .SuccessResponse(response, "Tenant created successfully");
        }

        // ================= GET ALL =================
        public async Task<ResponseDataModel<List<TenantDto>>> GetAllTenantSettingsAsync(
            CancellationToken cancellationToken)
        {
            var result = await _tenantRepository.GetAllAsync(cancellationToken);

            var list = result.Select(x => new TenantDto
            {
                Id = x.ID,
                Name = x.Name
            }).ToList();

            return ResponseDataModel<List<TenantDto>>
                .SuccessResponse(list);
        }

        // ================= GET BY ID =================
        public async Task<ResponseDataModel<TenantDto>> GetTenantSettingByIdAsync(
            int id,
            CancellationToken cancellationToken)
        {
            var entity = await _tenantRepository.GetByIdAsync(id, cancellationToken);

            if (entity == null)
                return ResponseDataModel<TenantDto>
                    .FailureResponse("Tenant not found");

            var dto = new TenantDto
            {
                Id = entity.ID,
                Name = entity.Name
            };

            return ResponseDataModel<TenantDto>
                .SuccessResponse(dto);
        }

        // ================= UPDATE =================
        public async Task<ResponseDataModel<TenantDto>> UpdateTenantSettingAsync(
            int id,
            CreateTenantDto dto,
            CancellationToken cancellationToken)
        {
            var entity = await _tenantRepository.GetByIdAsync(id, cancellationToken);

            if (entity == null)
                return ResponseDataModel<TenantDto>
                    .FailureResponse("Tenant not found");

            entity.Name = dto.Name;

            var updated = await _tenantRepository.UpdateAsync(entity, cancellationToken);

            var response = new TenantDto
            {
                Id = updated.ID,
                Name = updated.Name
            };

            return ResponseDataModel<TenantDto>
                .SuccessResponse(response, "Tenant updated successfully");
        }

        // ================= DELETE =================
        public async Task<ResponseDataModel<bool>> DeleteTenantSettingAsync(
            int id,
            CancellationToken cancellationToken)
        {
            var exists = await _tenantRepository.GetByIdAsync(id, cancellationToken);

            if (exists == null)
                return ResponseDataModel<bool>
                    .FailureResponse("Tenant not found");

            var deleted = await _tenantRepository.DeleteAsync(id, cancellationToken);

            return ResponseDataModel<bool>
                .SuccessResponse(deleted, "Tenant deleted successfully");
        }
    }
}