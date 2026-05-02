using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class QuotationItem : IMustHaveTenant
    {
        public int ID { get; set; }

        public int QuotationId { get; set; }

        public int ProductId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public int TenantId { get; set; }
        public Quotation Quotations { get; set; }
    }
}
