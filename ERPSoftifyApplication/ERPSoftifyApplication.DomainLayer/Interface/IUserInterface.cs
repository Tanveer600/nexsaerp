using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IUserInterface
    {
        Task<User> CreateAsync(User User, CancellationToken cancellationToken);

        Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken);

        Task<List<User>> GetAllAsync(CancellationToken cancellationToken);

        Task<User> UpdateAsync(User User, CancellationToken cancellationToken);

        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
        Task<User?> GetByLoginAsync(string email, int tenantId, CancellationToken cancellationToken);
        // Extra Enterprise Methods
        Task<User?> GetByUserNameAsync(string Email, CancellationToken cancellationToken);
        Task<bool> UpdatePasswordAsync(int userId, string passwordHash, CancellationToken cancellationToken);
        Task<bool> ActivateUserAsync(int userId, bool isActive, CancellationToken cancellationToken);
        // ===== Add these for FK validation =====
        Task<bool> CompanyExistsAsync(int companyId, CancellationToken cancellationToken);
        Task<bool> BranchExistsAsync(int branchId, CancellationToken cancellationToken);


        Task<User?> GetByEmailAsync(string email, int tenantId, CancellationToken cancellationToken);

        Task<bool> UserExistsAsync(string email, string username, int tenantId, CancellationToken cancellationToken);
    }
}
