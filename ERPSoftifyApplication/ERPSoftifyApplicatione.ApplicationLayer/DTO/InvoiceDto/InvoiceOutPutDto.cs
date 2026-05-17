using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.InvoiceDto
{
    public class InvoiceOutPutDto
    {
        public int ID { get; set; }
        public int SalesOrderId { get; set; }
        public DateTime Date { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal VAT { get; set; }
        public string PaymentStatus { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        public List<InvoiceItemOutPutDto> Items { get; set; } = new List<InvoiceItemOutPutDto>();   
    }

    public class InvoiceItemOutPutDto
    {
        public int ID { get; set; }
        public int InvoiceId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public int TenantId { get; set; }
    }

    public class CreateInvoiceOutPutDto
    {
        public int SalesOrderId { get; set; }
        public DateTime Date { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal VAT { get; set; }
        public string PaymentStatus { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        public List<CreateInvoiceItemOutPutDto> Items { get; set; } = new List<CreateInvoiceItemOutPutDto>();
    }

    public class CreateInvoiceItemOutPutDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public int TenantId { get; set; }
    }
}
