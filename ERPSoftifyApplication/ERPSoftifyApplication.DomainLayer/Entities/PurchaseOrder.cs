using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class PurchaseOrder: IMustHaveTenant,IMustHaveBranch
    {
        public int ID { get; set; }
        public string PONumber { get; set; } 
        public string CurrencyCode { get; set; } 
        public int VendorId { get; set; }

        public DateTime OrderDate { get; set; }

        public string Status { get; set; }
        public decimal ExchangeRate { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalAmount { get; set; }
        public int TenantId { get; set; }

        public int BranchId { get; set; }
        [ForeignKey(nameof(VendorId))]
        public Vendor Vendor { get; set; }
        public ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
    }
}
