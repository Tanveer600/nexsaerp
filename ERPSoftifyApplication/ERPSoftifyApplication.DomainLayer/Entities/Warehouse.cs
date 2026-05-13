using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Warehouse: IMustHaveTenant,IMustHaveBranch
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string ContactPerson { get; set; }
        public string Phone { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDefault { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        public virtual ICollection<GoodsReceivedItem> GoodsReceivedItems { get; set; } = new List<GoodsReceivedItem>();
        public virtual ICollection<DeliveryNoteItem> DeliveryNoteItems { get; set; } = new List<DeliveryNoteItem>();
        public virtual ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
    }
}
