using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class QuotationItem : IMustHaveTenant, IMustHaveBranch
    {
        public int ID { get; set; }
        public int QuotationId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal DiscountAmount { get; set; } 
        public decimal TaxPercentage { get; set; }
        public decimal TaxAmount { get; set; } 
        public decimal LineTotal { get; set; }  
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        [ForeignKey(nameof(QuotationId))]
        public Quotation Quotation { get; set; }
        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; } 
    }
}