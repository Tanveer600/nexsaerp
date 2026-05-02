using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Invoice: IMustHaveTenant
    {
        public int ID { get; set; }

        public int SalesOrderId { get; set; }

        public DateTime Date { get; set; }

        public decimal TotalAmount { get; set; }

        public decimal VAT { get; set; }

        public string PaymentStatus { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }
        public ICollection<InvoiceItems> Items { get; set; } = new List<InvoiceItems>();
        
    }
}
