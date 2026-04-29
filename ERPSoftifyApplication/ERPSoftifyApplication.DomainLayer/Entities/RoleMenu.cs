using ERPSoftifyApplication.DomainLayer.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class RoleMenu
{
    [Key] // Primary Key define karta hai
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Auto-increment (1,2,3...) set karta hai
    public int ID { get; set; }

    [Required]
    public int RoleId { get; set; }

    [ForeignKey("RoleId")]
    public virtual Role Role { get; set; }

    [Required]
    public int MenuId { get; set; }

    [ForeignKey("MenuId")]
    public virtual Menu Menu { get; set; }
    public int? PermissionId { get; set; }
    [ForeignKey("PermissionId")]
    public virtual Permission Permission { get; set; }

    [Required]
    public int TenantId { get; set; }
}