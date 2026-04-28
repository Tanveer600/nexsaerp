using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class User: IMustHaveTenant,IMustHaveBranch
    {
        public int ID { get; set; }

        // Required fields
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        public int CompanyId { get; set; }

        // Optional / nullable fields
        public string? PhoneNumber { get; set; }
        public string? WebsiteUrl { get; set; }
        public int EmployeeId { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public string Status { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } 
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }
        public Role Role { get; set; } = null!;
        public TenantSetting Tenant { get; set; } = null!;
        public Branch Branch { get; set; } = null!;
        public CompanySetting Company { get; set; } = null!;
        public Employee Employee { get; set; } = null!;
    }
}
