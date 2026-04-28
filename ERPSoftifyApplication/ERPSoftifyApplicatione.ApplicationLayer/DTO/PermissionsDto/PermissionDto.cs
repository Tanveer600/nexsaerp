using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.PermissionsDto
{
    public class PermissionDto
    {
        public int Id { get; set; } 
        public string PermissionName { get; set; } = null!;
        public string? Description { get; set; }
        public int TenantId { get; set; }

        public bool CanView { get; set; }
        public bool CanAdd { get; set; }
        public bool CanUpdate { get; set; }
        public bool CanDelete { get; set; }
    }
    public class CreatePermissionDto
    {
        public string PermissionName { get; set; } = null!;
        public string? Description { get; set; }
        public int TenantId { get; set; }

        public bool CanView { get; set; }
        public bool CanAdd { get; set; }
        public bool CanUpdate { get; set; }
        public bool CanDelete { get; set; }
    }

    public class UpdatePermissionDto
    {
        public string PermissionName { get; set; } = null!;
        public string? Description { get; set; }
        public bool CanView { get; set; }
        public bool CanAdd { get; set; }
        public bool CanUpdate { get; set; }
        public bool CanDelete { get; set; }
    }
}
