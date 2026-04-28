// DomainLayer/Entities/Branch.cs
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Branch: IMustHaveTenant
    {
        public int Id { get; set; }
        public int TenantId { get; set; }

        // New: Branch Code
        public string Code { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        // Address can be a single string or separate entity if needed
        public string? Street { get; set; }
        public string? City { get; set; }
        public string? Emirate { get; set; }

        public string? ContactPerson { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }

        public bool IsDefault { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public int EmployeeCount { get; set; } = 0;

        // Parent/Child relationship
        public int? ParentBranchId { get; set; }
        public Branch? ParentBranch { get; set; }
        public ICollection<Branch> ChildBranches { get; set; } = new List<Branch>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}