using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.User
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public int TenantId { get; set; }
    }
}
