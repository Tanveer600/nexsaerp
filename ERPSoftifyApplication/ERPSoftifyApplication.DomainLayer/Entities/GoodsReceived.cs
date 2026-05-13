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
    public class GoodsReceived : IMustHaveTenant, IMustHaveBranch
    {
        public int ID { get; set; }
        public string GRNNumber { get; set; }
        public int POId { get; set; }
        public DateTime Date { get; set; }
        public string VendorChallanNumber { get; set; }
        public string Remarks { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        public int WarehouseId { get; set; }
        [ForeignKey(nameof(WarehouseId))]
        public virtual Warehouse Warehouse { get; set; }
        [ForeignKey(nameof(POId))]
        public virtual PurchaseOrder PurchaseOrder { get; set; }
        public virtual ICollection<GoodsReceivedItem> Items { get; set; } = new List<GoodsReceivedItem>();
    }
}
