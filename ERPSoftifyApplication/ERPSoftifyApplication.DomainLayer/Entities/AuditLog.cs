using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class AuditLog: IMustHaveTenant
    {
        public int ID { get; set; }

        public string TableName { get; set; }

        public int RecordId { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }

        public string Action { get; set; }        // e.g., "Insert", "Update", "Delete"

        public string OldValues { get; set; }     // JSON or serialized string

        public string NewValues { get; set; }     // JSON or serialized string

        public int PerformedBy { get; set; }      // EmployeeId / UserId

        public DateTime PerformedAt { get; set; }
    }
}
