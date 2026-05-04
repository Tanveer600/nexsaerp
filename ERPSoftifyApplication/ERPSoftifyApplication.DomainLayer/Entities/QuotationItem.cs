using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class QuotationItem : IMustHaveTenant,IMustHaveBranch
    {
        public int ID { get; set; }

        public int QuotationId { get; set; }

        public int ProductId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }


        [ForeignKey(nameof(QuotationId))]
        public Quotation Quotation { get; set; }


    }
}
