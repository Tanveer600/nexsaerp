using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class VendorQuotationItem : IMustHaveTenant, IMustHaveBranch
    {
        public int ID { get; set; }
        public int VQId { get; set; } 
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

        [ForeignKey(nameof(VQId))]
        public VendorQuotation VendorQuotation { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; }
    }
}