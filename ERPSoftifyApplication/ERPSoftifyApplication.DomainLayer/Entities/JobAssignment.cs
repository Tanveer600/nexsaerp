using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class JobAssignment: IMustHaveTenant
    {
        public int ID { get; set; }

        public int JobId { get; set; }

        public int TechnicianId { get; set; }  // EmployeeId

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
