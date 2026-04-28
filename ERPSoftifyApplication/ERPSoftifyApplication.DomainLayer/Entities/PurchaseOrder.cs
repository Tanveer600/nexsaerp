using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class PurchaseOrder: IMustHaveTenant
    {
        public int ID { get; set; }

        public int VendorId { get; set; }

        public DateTime OrderDate { get; set; }

        public string Status { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
