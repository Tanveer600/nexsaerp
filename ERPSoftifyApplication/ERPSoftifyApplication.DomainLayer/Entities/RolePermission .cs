using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class RolePermission: IMustHaveTenant
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;
        public Permission Permission { get; set; } = null!;
        public int TenantId { get; set; }
        public int PermissionId { get; set; }
        
    }
}
