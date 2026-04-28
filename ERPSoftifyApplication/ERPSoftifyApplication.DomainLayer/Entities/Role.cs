using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Role: IMustHaveTenant
    {
        public int ID { get; set; }

        public string RoleName { get; set; }

        public string Description { get; set; } = string.Empty;

        public int TenantId { get; set; }
    }
}
