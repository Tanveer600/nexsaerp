using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Menu: IMustHaveTenant
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;
        public string Url { get; set; } = null!;
        public string Icon { get; set; } = null!;
        public int TenantId { get; set; }
        public int? ParentId { get; set; }
        public Menu? Parent { get; set; }

        public bool IsActive { get; set; } = true;
        public ICollection<Menu> Children { get; set; } = new List<Menu>();
        public ICollection<RoleMenu> RoleMenus { get; set; } = new List<RoleMenu>();
    }
}
