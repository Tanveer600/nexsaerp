using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.PaymentDto
{

    
    public class PaymentDto
    {
        public int ID { get; set; }

        public int InvoiceId { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public string Mode { get; set; }

        public string Status { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
    public class CreatePaymentDto
    {
     

        public int InvoiceId { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public string Mode { get; set; }

        public string Status { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }

    }
    
    public class UpdatePaymentDto
    {
        public int ID { get; set; }

        public int InvoiceId { get; set; }

        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public string Mode { get; set; }

        public string Status { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
