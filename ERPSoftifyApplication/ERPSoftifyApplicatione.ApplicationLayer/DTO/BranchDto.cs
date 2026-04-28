using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO
{
    public class BranchDto
    {

        public int Id { get; set; }

        // Tenant link
        public int TenantId { get; set; }

        // Branch info
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Street { get; set; }
        public string? City { get; set; }
        public string? Emirate { get; set; }
        public string? ContactPerson { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public bool IsDefault { get; set; } = false;

        // Hierarchy
        public int? ParentBranchId { get; set; }
        public string? ParentBranchName { get; set; } // optional for display

        // Children
        public List<BranchDto>? ChildBranches { get; set; }

        // Status
        public bool IsActive { get; set; } = true;
        public int EmployeeCount { get; set; } = 0;

        // Audit
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
    }

