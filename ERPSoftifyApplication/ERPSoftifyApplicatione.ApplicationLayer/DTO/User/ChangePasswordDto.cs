using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.User
{
    public class ChangePasswordDto
    {
        public int UserId { get; set; }

        public string CurrentPassword { get; set; } = null!;

        public string NewPassword { get; set; } = null!;
    }
}
