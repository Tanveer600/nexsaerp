using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class DeliveryNoteItem : IMustHaveTenant
    {
        public int ID { get; set; }
       // public int WarehouseId { get; set; }
        public int DeliveryNoteId { get; set; }
        public int SalesOrderItemId { get; set; }
        public int ProductId { get; set; }
        public decimal QuantityDelivered { get; set; }
        public int TenantId { get; set; }

        //[ForeignKey("WarehouseId")]
        //public virtual Warehouse Warehouse { get; set; }

        [ForeignKey("DeliveryNoteId")]
        public virtual DeliveryNote DeliveryNote { get; set; }
    }
}
