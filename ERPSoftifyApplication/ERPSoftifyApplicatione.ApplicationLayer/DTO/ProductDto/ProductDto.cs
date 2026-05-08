using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto
{
    public class ProductDto
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
    }
    public class UpdateProductDto
    {

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
    }
    public class CreateProductDto
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
    }
}
