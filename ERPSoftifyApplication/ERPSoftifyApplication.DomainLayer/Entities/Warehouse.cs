using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Warehouse: IMustHaveTenant
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public string Location { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
