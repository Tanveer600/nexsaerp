using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.Order
{
    public class OrderDto
    {
        public int VendorId { get; set; }

        public DateTime OrderDate { get; set; }

        public string Status { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
