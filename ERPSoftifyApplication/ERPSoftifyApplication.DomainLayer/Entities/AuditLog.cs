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
        public string OldValues { get; set; } 
        public string NewValues { get; set; } 
        public string ChangedColumns { get; set; }
        public int PerformedBy { get; set; } 
        public DateTime PerformedAt { get; set; }
        public string IPAddress { get; set; }
        public string UserAgent { get; set; } 
        public int TenantId { get; set; }
        public int BranchId { get; set; }
    }
}
