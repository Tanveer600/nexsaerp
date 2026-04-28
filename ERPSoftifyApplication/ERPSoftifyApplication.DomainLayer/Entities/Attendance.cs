using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Attendance: IMustHaveTenant
    {
        public int ID { get; set; }

        public int EmployeeId { get; set; }

        public DateTime Date { get; set; }

        public DateTime CheckIn { get; set; }

        public DateTime CheckOut { get; set; }

        public string Method { get; set; }  // e.g., "Biometric", "Manual"

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
