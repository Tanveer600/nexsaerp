using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PermissionsDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.User;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface ICompanySettingService
    {
        Task<UserProfileDto> GetUserProfileAsync(int userId, CancellationToken cancellationToken);
        Task<UserProfileDto> SaveOrUpdateUserProfileAsync(UserProfileDto user, IFormFile? profileImage, CancellationToken cancellationToken);
        Task<ResponseDataModel<List<CompanySetting>>> GetAllCompanyAsync(CancellationToken cancellationToken);
        // ----- COMPANY -----
        Task<CompanySetting> GetCompanySettingAsync(int companyId, CancellationToken cancellationToken);
        Task<CompanySetting> SaveOrUpdateCompanySettingAsync(CompanySetting company, CancellationToken cancellationToken);
    }
}
