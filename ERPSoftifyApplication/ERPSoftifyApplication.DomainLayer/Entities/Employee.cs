using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Employee: IMustHaveTenant
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public int RoleId { get; set; }

        public decimal Salary { get; set; }

        public string Documents { get; set; }  // e.g., file paths or document references

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
