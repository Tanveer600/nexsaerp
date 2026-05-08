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
    public class SalesOrderItem : IMustHaveTenant, IMustHaveBranch
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

        [ForeignKey(nameof(SOId))]
        public SalesOrder SalesOrder { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; }

    }
}
