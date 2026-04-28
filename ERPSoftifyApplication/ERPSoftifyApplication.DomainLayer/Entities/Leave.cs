using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Leave: IMustHaveTenant
    {
        public int ID { get; set; }

        public int EmployeeId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string Type { get; set; }   // e.g., "Sick", "Casual", "Annual"

        public string Status { get; set; } // e.g., "Approved", "Pending", "Rejected"

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
