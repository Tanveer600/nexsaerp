using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class GoodsReceived: IMustHaveTenant
    {
        public int ID { get; set; }

        public int POId { get; set; }

        public DateTime Date { get; set; }

        public int QuantityReceived { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
