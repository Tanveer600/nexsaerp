using ERPSoftifyApplication.DomainLayer.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class RoleMenu
{
    
    public int ID { get; set; }

    public int RoleId { get; set; }

    public virtual Role Role { get; set; }

    public int MenuId { get; set; }

    public virtual Menu Menu { get; set; }
    public int? PermissionId { get; set; }
    public virtual Permission Permission { get; set; }
    public int TenantId { get; set; }
}