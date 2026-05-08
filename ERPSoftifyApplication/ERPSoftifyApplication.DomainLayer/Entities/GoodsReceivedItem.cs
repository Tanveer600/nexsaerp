using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class GoodsReceivedItem
    {
        public int ID { get; set; }

        public int GoodsReceivedId { get; set; }

        public int ProductId { get; set; }

        public int QuantityReceived { get; set; }

        // Dubai/Pakistan Standards: Maal kis warehouse mein gaya?
        public int WarehouseId { get; set; }

        // Inventory Tracking (Batch and Expiry)
        public string BatchNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }

        // Relationships
        [ForeignKey(nameof(GoodsReceivedId))]
        public virtual GoodsReceived GoodsReceived { get; set; }

        [ForeignKey(nameof(ProductId))]
        public virtual Product Product { get; set; }

        [ForeignKey(nameof(WarehouseId))]
        public virtual Warehouse Warehouse { get; set; }
    }
}
