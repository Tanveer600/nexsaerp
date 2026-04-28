using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface ICompanySettingInterface
    {
        Task<User> GetUserProfileAsync(int userId, CancellationToken cancellationToken);

        // Accept profile image as byte array and filename
        Task<User> SaveOrUpdateUserProfileAsync(User user, byte[]? profileImageBytes, string? profileImageFileName, CancellationToken cancellationToken
        );
        Task<List<CompanySetting>> GetAllAsync(CancellationToken cancellationToken);
        Task<CompanySetting> GetCompanySettingAsync(int companyId, CancellationToken cancellationToken);
        Task<CompanySetting> SaveOrUpdateCompanySettingAsync(CompanySetting company, CancellationToken cancellationToken);
    }
}
