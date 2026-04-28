using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PermissionsDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.User;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class CompanySettingService:ICompanySettingService
    {
        private readonly ICompanySettingInterface _repository;

        public CompanySettingService(ICompanySettingInterface repository)
        {
            _repository = repository;
        }

        // ================== USER PROFILE ==================
        public async Task<UserProfileDto?> GetUserProfileAsync(int userId, CancellationToken cancellationToken)
        {
            var user = await _repository.GetUserProfileAsync(userId, cancellationToken);

            if (user == null)
                return null;

            return new UserProfileDto
            {
                Id = user.ID,
                Name = user.Name,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                WebsiteUrl = user.WebsiteUrl,
                ProfilePictureUrl = user.ProfilePictureUrl,
            };
        }

        public async Task<UserProfileDto> SaveOrUpdateUserProfileAsync(UserProfileDto dto, IFormFile? profileImage, CancellationToken cancellationToken)
        {
            byte[]? imageBytes = null;
            string? fileName = null;

            if (profileImage != null && profileImage.Length > 0)
            {
                using var ms = new MemoryStream();
                await profileImage.CopyToAsync(ms, cancellationToken);
                imageBytes = ms.ToArray();
                fileName = profileImage.FileName;
            }

            // Mapping: DTO -> Entity (Sirf update honay wali fields)
            var entity = new User
            {
                ID = dto.Id,
                Name = dto.Name,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                WebsiteUrl = dto.WebsiteUrl,
            };

            var savedUser = await _repository.SaveOrUpdateUserProfileAsync(entity, imageBytes, fileName, cancellationToken);

            // Mapping: Entity -> DTO (Wapsi ka data)
            return new UserProfileDto
            {
                Id = savedUser.ID,
                Name = savedUser.Name,
                Email = savedUser.Email,
                PhoneNumber = savedUser.PhoneNumber,
                ProfilePictureUrl = savedUser.ProfilePictureUrl,
                WebsiteUrl = savedUser.WebsiteUrl
            };
        }
        // ================== COMPANY ==================
        public async Task<CompanySetting> GetCompanySettingAsync(int companyId, CancellationToken cancellationToken)
        {
            return await _repository.GetCompanySettingAsync(companyId, cancellationToken);
        }

        public async Task<CompanySetting> SaveOrUpdateCompanySettingAsync(CompanySetting company, CancellationToken cancellationToken)
        {
            return await _repository.SaveOrUpdateCompanySettingAsync(company, cancellationToken);
        }

       
        public async Task<ResponseDataModel<List<CompanySetting>>> GetAllCompanyAsync(CancellationToken cancellationToken)
        {
            var result = await _repository.GetAllAsync(cancellationToken);
            return ResponseDataModel<List<CompanySetting>>.SuccessResponse(result);
        }
    }
}
