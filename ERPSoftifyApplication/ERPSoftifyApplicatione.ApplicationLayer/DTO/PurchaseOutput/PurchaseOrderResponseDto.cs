
using System;
using System.Collections.Generic;
using System.Linq;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.PurchaseDto
{
    public class PurchaseOrderResponseDto
    {
        public int ID { get; set; }
        public int VendorId { get; set; }
        public string PONumber { get; set; }
        public string CurrencyCode { get; set; }
        public string VendorName { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }

        public List<PurchaseOrderItemResponseDto> Items { get; set; } = new();

        public decimal TotalDiscount => Items.Sum(x => x.Discount);
        public decimal TotalTax => Items.Sum(x => x.TaxAmount);
        public decimal SubTotal => Items.Sum(x => x.Quantity * x.UnitPrice);
        public decimal GrandTotal => (SubTotal - TotalDiscount) + TotalTax;
    }

    public class PurchaseOrderItemResponseDto
    {
        public int ID { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal TaxPercentage { get; set; } // Added missing property
        public decimal TaxAmount { get; set; }
        public decimal LineTotal { get; set; } // Manual set in mapping or calculated
        public int ReceivedQuantity { get; set; } // Added to match service mapping
    }

    public class PurchaseOrderRequestDto
    {
        public int ID { get; set; }
        public int VendorId { get; set; }
        public DateTime OrderDate { get; set; }
        public string PONumber { get; set; }
        public string CurrencyCode { get; set; }
        public string Status { get; set; }
        public List<PurchaseOrderItemRequestDto> Items { get; set; } = new();
    }

    public class PurchaseOrderItemRequestDto
    {
        public int? ID { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal LineTotal { get; set; }
        public int? ReceivedQuantity { get; set; }
        public decimal TaxPercentage { get; set; }
    }
}

