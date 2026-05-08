using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Quotation : IMustHaveTenant, IMustHaveBranch
    {
        public int ID { get; set; }
        public int CustomerId { get; set; }
        public DateTime Date { get; set; }
        public DateTime ValidUntil { get; set; }
        public string QuotationNumber { get; set; }
        public string Status { get; set; } 
        public decimal SubTotal { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal NetAmount { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        public ICollection<QuotationItem> QuotationItems { get; set; } = new List<QuotationItem>();
        [ForeignKey(nameof(CustomerId))]
        public Customer Customer { get; set; }
    }
}