using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Payment: IMustHaveTenant,IMustHaveBranch
    {
        public int ID { get; set; }

        public int InvoiceId { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public string Mode { get; set; }   

        public string Status { get; set; }  

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
