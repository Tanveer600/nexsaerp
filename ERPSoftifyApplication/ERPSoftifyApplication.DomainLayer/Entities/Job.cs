using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Job: IMustHaveTenant
    {
        public int ID { get; set; }

        public int CustomerId { get; set; }

        public int AssignedTo { get; set; }  // EmployeeId / TechnicianId

        public string Status { get; set; }   // e.g., "Pending", "InProgress", "Completed"

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
