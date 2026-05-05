using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
   public class UserEmail : IMustHaveTenant
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string FromEmail { get; set; }
        public string ToEmail { get; set; }
        public DateTime ReceivedDate { get; set; }
        public bool IsRead { get; set; }
        public int TenantId { get; set; }
    }
}
