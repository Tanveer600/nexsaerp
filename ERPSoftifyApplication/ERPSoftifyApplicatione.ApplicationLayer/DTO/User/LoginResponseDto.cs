using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.User
{
    public class LoginResponseDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = null!;
        public int RoleId { get; set; }
        public int Branchd { get; set; }
        public string Token { get; set; } = null!;
        public int TenantId { get; set; }
        public int CompanyId { get; set; }
    }           


}
