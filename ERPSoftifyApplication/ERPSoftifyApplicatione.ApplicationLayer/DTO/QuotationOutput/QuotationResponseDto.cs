using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.QuotationOutput
{
    
        public class QuotationResponseDto
        {
        public int ID { get; set; }
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }

        public DateTime Date { get; set; }

        public decimal TotalAmount { get; set; }

        public string Status { get; set; }

        public List<QuotationItemResponseDto> QuotationItems { get; set; } = new();

            public decimal TotalDiscount => QuotationItems.Sum(x => x.Discount);
            public decimal TotalTax => QuotationItems.Sum(x => x.TaxAmount);
            public decimal SubTotal => QuotationItems.Sum(x => x.Quantity * x.UnitPrice);
            public decimal GrandTotal => (SubTotal - TotalDiscount) + TotalTax;
        }

        public class QuotationItemResponseDto
        {
            public int ID { get; set; }
            public int ProductId { get; set; }
            public string ProductName { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
            public decimal Discount { get; set; }
            public decimal TaxAmount { get; set; }
            public decimal LineTotal => (Quantity * UnitPrice - Discount) + TaxAmount;
        }


        public class QuotationRequestDto
        {
            public int ID { get; set; }
            public int CustomerId { get; set; }
            public DateTime OrderDate { get; set; }
            public string Status { get; set; }
            public List<QuotationItemRequestDto> QuotationItems { get; set; } = new();
        }

        public class QuotationItemRequestDto
        {
            public int? ID { get; set; }
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
            public decimal Discount { get; set; }
            public decimal TaxAmount { get; set; }
        }
    }

