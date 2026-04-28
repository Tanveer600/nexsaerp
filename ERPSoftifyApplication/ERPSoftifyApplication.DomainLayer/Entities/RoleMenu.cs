using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class RoleMenu: IMustHaveTenant
    {

        public int Id { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; }
        public int TenantId { get; set; }

        public int MenuId { get; set; }
        public Menu Menu { get; set; }
        
    }
}
