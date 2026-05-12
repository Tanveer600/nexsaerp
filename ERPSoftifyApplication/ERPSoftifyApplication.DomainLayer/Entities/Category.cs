using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Category : IMustHaveTenant
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsActive { get; set; } = true;
        public int TenantId { get; set; }

        public virtual ICollection<Product> Products { get; set; }
    }
}
