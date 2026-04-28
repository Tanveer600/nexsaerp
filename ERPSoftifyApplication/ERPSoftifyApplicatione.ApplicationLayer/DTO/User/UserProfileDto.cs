using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.User
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string? Department { get; set; }
        public int EmployeeId { get; set; }
        public string? WebsiteUrl { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public int CompanyId { get; set; }
        public int RoleId { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        public bool IsActive { get; set; }
    }
}
