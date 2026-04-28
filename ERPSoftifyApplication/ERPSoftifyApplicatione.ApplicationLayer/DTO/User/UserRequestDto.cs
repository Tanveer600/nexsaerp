using Microsoft.AspNetCore.Http;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTOs
{
    public class UserRequestDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public int EmployeeId { get; set; }
        public int CompanyId { get; set; }
        public string? WebsiteUrl { get; set; }

        public IFormFile? ProfileImage
        {
            get; set;
        }
}
}