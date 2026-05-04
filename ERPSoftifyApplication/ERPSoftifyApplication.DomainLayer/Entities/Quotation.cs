using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Quotation: IMustHaveTenant,IMustHaveBranch
    {
        public int ID { get; set; }

        public int CustomerId { get; set; }

        public DateTime Date { get; set; }

        public decimal TotalAmount { get; set; }

        public string Status { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }

        public ICollection<QuotationItem> QuotationItems { get; set; } = new List<QuotationItem>();
    }
}
