using System;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class UserProfile
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;

        // Optional profile picture URL
        public string? ProfilePictureUrl { get; set; }  // Can be null if not uploaded

        // Foreign key to Company
        public int CompanyId { get; set; }
        public CompanySetting Company { get; set; } = null!;
    }
}