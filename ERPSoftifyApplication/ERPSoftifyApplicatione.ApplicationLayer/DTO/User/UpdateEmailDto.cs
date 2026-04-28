using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.User
{
    public class UpdateEmailDto
    {
        public int UserId { get; set; }
        public string NewEmail { get; set; } = null!;
    }
}
