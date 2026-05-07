using ERPSoftifyApplication.DomainLayer.Entities;
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
        public int QuotationId { get; set; }

        public DateTime OrderDate { get; set; }

        public string Status { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }

        public ICollection<SaleItemViewDto> Items { get; set; } = new List<SaleItemViewDto>();
    }

    public class SaleItemViewDto
    {

        public int SOId { get; set; }

        public int ProductId { get; set; }
        public string ProductName { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal Discount { get; set; }

        public decimal TaxAmount { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }

        public int QuotationId { get; set; }

    }

    public class CreateSaleRequest
    {

        public int QuotationId { get; set; }

        public DateTime OrderDate { get; set; }

        public string Status { get; set; }

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

        public int TenantId { get; set; }

        public int BranchId { get; set; }

        public int QuotationId { get; set; }


    }

    public class UpdateSaleRequest
    {
        public int ID { get; set; }

        public int QuotationId { get; set; }

        public DateTime OrderDate { get; set; }

        public string Status { get; set; }

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

        public int TenantId { get; set; }

        public int BranchId { get; set; }

        public int QuotationId { get; set; }
    }
}

