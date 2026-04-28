using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class StockTransaction: IMustHaveTenant
    {
        public int ID { get; set; }

        public int ProductId { get; set; }

        public int WarehouseId { get; set; }

        public string Type { get; set; }  // e.g., "IN" or "OUT"

        public int Quantity { get; set; }

        public DateTime Date { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
