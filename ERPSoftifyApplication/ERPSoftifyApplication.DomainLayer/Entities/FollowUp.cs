using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class FollowUp: IMustHaveTenant
    {
        public int ID { get; set; }

        public int LeadId { get; set; }

        public DateTime Date { get; set; }

        public string Type { get; set; }

        public string Notes { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
