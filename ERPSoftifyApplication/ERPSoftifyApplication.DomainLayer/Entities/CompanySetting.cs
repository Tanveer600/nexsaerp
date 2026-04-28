using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class CompanySetting: IMustHaveTenant
    {
        public int Id { get; set; } 
        public string CompanyName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;  
        public int TenantId { get; set; }
        public string Phone { get; set; } = string.Empty; 
        public DateTime UpdatedAt { get; set; }  
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
