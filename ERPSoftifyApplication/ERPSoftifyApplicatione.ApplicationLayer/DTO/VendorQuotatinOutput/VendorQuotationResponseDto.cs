using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.VendorQuotatinOutput
{
    public class VendorQuotationViewDto
    {
        public string VQNumber { get; set; }
        public int VendorId { get; set; }
        public int ID { get; set; }
        public int VQId { get; set; }
        public DateTime QuotationDate { get; set; }
        public DateTime ValidUntil { get; set; }
        public string CurrencyCode { get; set; }
        public decimal SubTotal { get; set; }
        public string VendorName { get; set; }
        public decimal ExchangeRate { get; set; }
        public string Status { get; set; }
       
        public decimal TotalDiscount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal NetAmount { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        public decimal GrandTotal { get; set; }
        public List<VendorQuotationItemViewDto> Items { get; set; } = new();
    }

    public class VendorQuotationItemViewDto
    {
        public int ID { get; set; }
        public int VQId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal TaxPercentage { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal LineTotal { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
    }

    public class CreateVendorQuotationRequest
    {
        public string VQNumber { get; set; }
        public int VendorId { get; set; }
        public DateTime QuotationDate { get; set; }
        public DateTime ValidUntil { get; set; }
        public string CurrencyCode { get; set; }
        public decimal ExchangeRate { get; set; }
        public string Status { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal NetAmount { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }

        public List<CreateVendorQuotationItemRequest> Items { get; set; } = new();
    }

    public class CreateVendorQuotationItemRequest
    {
        public int VQId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TaxPercentage { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal LineTotal { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }

    }

    public class UpdateVendorQuotationRequest
    {
        public int VendorQuotationId { get; set; }
        public string VQNumber { get; set; }
        public int VendorId { get; set; }
        public DateTime QuotationDate { get; set; }
        public DateTime ValidUntil { get; set; }
        public string CurrencyCode { get; set; }
        public decimal ExchangeRate { get; set; }
        public string Status { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal NetAmount { get; set; }

        public List<CreateVendorQuotationItemRequest> Items { get; set; } = new();
    }

    public class UpdateVendorQuotationItemRequest
    {
        public int ID { get; set; }
        public int VQId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal TaxPercentage { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal LineTotal { get; set; }

    }
}


