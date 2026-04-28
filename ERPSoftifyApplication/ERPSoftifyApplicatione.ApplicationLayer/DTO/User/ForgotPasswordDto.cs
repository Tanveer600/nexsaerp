using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.User
{
    public class ForgotPasswordDto
    {
        public string Email { get; set; } = null!;
        public int TenantId { get; set; }
    }
}
