using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class TenantSetting
    {
        public int ID { get; set; }

        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }

       
    }
}
