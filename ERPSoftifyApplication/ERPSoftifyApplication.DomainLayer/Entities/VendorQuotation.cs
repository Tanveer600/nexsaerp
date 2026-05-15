using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class VendorQuotation : IMustHaveTenant, IMustHaveBranch
    {
        public int ID { get; set; }
        public int VendorQuotationId { get; set; }
        public string VQNumber { get; set; } 
        public int VendorId { get; set; }
        public DateTime QuotationDate { get; set; }
        public DateTime ValidUntil { get; set; } 
        public string CurrencyCode { get; set; }
        public decimal SubTotal { get; set; }
        public decimal ExchangeRate { get; set; }
        public string Status { get; set; } 
        public decimal TotalDiscount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal NetAmount { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        [ForeignKey(nameof(VendorId))]
        public Vendor Vendor { get; set; }
        public ICollection<VendorQuotationItem> Items { get; set; } = new List<VendorQuotationItem>();
    }
}