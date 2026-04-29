using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO
{

    public class RoleMenuDto
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; } 
        public int MenuId { get; set; }
        public string MenuTitle { get; set; } 
        public int TenantId { get; set; }
    }

    public class CreateRoleMenuDto
    {
        public int RoleId { get; set; }
        public List<int> MenuIds { get; set; }
        public int TenantId { get; set; }
    }

    public class AssignRoleMenusDto
    {
        public int RoleId { get; set; }
        public int TenantId { get; set; }
        public List<MenuPermissionDto> MenuPermissions { get; set; } 
    }

    public class MenuPermissionDto
    {
        public int MenuId { get; set; }
        public int PermissionId { get; set; }
    }

    public class UpdateRoleMenuDto
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public List<int> MenuIds { get; set; }
    }
}
