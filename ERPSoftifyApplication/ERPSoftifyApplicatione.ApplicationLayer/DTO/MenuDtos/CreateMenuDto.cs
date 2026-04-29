using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.MenuDtos
{
    public class CreateMenuDto
    {
        public string Title { get; set; } = null!;
        public string Url { get; set; } = null!;
        public string Icon { get; set; } = null!;
        public int TenantId { get; set; }
        public int? ParentId { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateMenuDto
    {
        public int Id { get; set; } 
        public string Title { get; set; } = null!;
        public string Url { get; set; } = null!;
        public string Icon { get; set; } = null!;
        public int TenantId { get; set; }
        public int? ParentId { get; set; }
        public bool IsActive { get; set; } = true;
    }
    public class MenuDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Url { get; set; } = null!;
        public string Icon { get; set; } = null!;
        public int TenantId { get; set; }
        public bool IsActive { get; set; }
        public int? ParentId { get; set; }
        public bool CanView { get; set; }
        public bool CanAdd { get; set; }
        public bool CanUpdate { get; set; }
        public bool CanDelete { get; set; }
        public string? ParentTitle { get; set; } 
        public List<MenuDto> Children { get; set; } = new List<MenuDto>();
    }
}
