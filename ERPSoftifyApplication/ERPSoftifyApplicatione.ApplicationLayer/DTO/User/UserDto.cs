using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.User
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; 
        public string? BranchName { get; set; } = string.Empty;  
        public string? TenantName { get; set; } = string.Empty; 
        public string? RoleName { get; set; } = string.Empty; 
        public string? EmployeeName { get; set; } = string.Empty;   
        public string? CompanyName { get; set; } = string.Empty;   
        public string Email { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }  
        public int EmployeeId { get; set; } = 0;
        public int CompanyId { get; set; } = 0;
        public string? PhoneNumber { get; set; }
        public string? WebsiteUrl { get; set; }
        public string Status { get; set; }
        public bool? IsActive { get; set; } = true;
    }

    public class CreateUserDto
    {
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public int RoleId { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        public int CompanyId { get; set; }
        public string? PhoneNumber { get; set; }
        public string? WebsiteUrl { get; set; }
        public int EmployeeId { get; set; }
        public bool? IsActive { get; set; }
        public string Status { get; set; }
    }
    public class UpdateUserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public int RoleId { get; set; }
        public int BranchId { get; set; }
        public int CompanyId { get; set; }
        public int TenantId { get; set; }
        public string Status { get; set; }
        public bool? IsActive { get; set; }
        // Password update ke liye optional hona chahiye
        public string? Password { get; set; }
    }
}
