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
    public class DeliveryNote : IMustHaveTenant, IMustHaveBranch
    {
        public int ID { get; set; }

        public int SaleOrderId { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }

        public int WarehouseId { get; set; } 

        [ForeignKey("WarehouseId")] 
        public virtual Warehouse Warehouse { get; set; }

        public virtual ICollection<DeliveryNoteItem> DeliveryNoteItems { get; set; } = new List<DeliveryNoteItem>();
    }
}
