using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO
{
   public class SendEmailDto
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }

    public class SyncInboxDto
    {
        public string Email { get; set; }
        public string AppPassword { get; set; }
        public int TenantId { get; set; }
    }
}
