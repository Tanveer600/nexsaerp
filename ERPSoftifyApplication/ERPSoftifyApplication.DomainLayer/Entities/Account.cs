using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Account: IMustHaveTenant
    {
        public int ID { get; set; }

        public string AccountName { get; set; }

        public string Type { get; set; } // e.g., "Asset", "Liability", "Income", "Expense"

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
