using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class Product: IMustHaveTenant
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string SKU { get; set; }
        public string Barcode { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal VatPercentage { get; set; } = 5;
        public int ReorderLevel { get; set; } 
        public bool ManageStock { get; set; } = true; 
        public string UOM { get; set; }
        public int CategoryId { get; set; }
        public int TenantId { get; set; }
         [ForeignKey(nameof(CategoryId))]
         public virtual Category Category { get; set; }
    }
}

