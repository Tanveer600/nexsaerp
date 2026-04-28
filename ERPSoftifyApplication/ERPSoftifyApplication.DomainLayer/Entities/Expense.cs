using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Expense: IMustHaveTenant
    {
        public int ID { get; set; }

        public int ProjectId { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public string Category { get; set; }  // e.g., "Travel", "Materials", "Misc"

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
