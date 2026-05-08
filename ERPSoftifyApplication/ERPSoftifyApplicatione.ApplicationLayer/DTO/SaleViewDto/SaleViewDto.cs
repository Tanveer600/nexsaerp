using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.Quotation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.SalesOutput
{
    public class SaleViewDto
    {
        public int ID { get; set; }
        public string SONumber { get; set; }
        public int CustomerId { get; set; }
        public int QuotationId { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalAmount { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        public List<SaleItemViewDto> Items { get; set; } = new();
        
    }

    public class SaleItemViewDto
    {

        public int ID { get; set; }
        public int SOId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TaxPercentage { get; set; }
        public decimal LineTotal { get; set; }
        public int DeliveredQuantity { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }

    }

    public class CreateSaleRequest
    {
        public string SONumber { get; set; }
        public int CustomerId { get; set; }
        public int QuotationId { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalAmount { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        public List<CreateSaleItemRequest> Items { get; set; } = new();
    }

    public class CreateSaleItemRequest
    {
        public int SOId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TaxPercentage { get; set; }
        public decimal LineTotal { get; set; }
        public int DeliveredQuantity { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }

    }

    public class UpdateSaleRequest
    {
        public int ID { get; set; }
        public string SONumber { get; set; }
        public int CustomerId { get; set; }
        public int QuotationId { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalAmount { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }

        public List<UpdateSaleItemRequest> Items { get; set; } = new();
    }

    public class UpdateSaleItemRequest
    {
        public int ID { get; set; }
        public int SOId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TaxPercentage { get; set; }
        public decimal LineTotal { get; set; }
        public int DeliveredQuantity { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
    }
}

