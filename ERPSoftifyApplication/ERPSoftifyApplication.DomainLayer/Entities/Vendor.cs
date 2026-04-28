using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Vendor: IMustHaveTenant
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public string Contact { get; set; }

        public string Address { get; set; }

        public int TenantId { get; set; }
    }
}
