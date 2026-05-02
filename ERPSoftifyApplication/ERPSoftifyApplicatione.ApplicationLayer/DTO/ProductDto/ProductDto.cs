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

        public decimal UnitPrice { get; set; }
    }
    public class UpdateProductDto
    {
     
        public string Name { get; set; }

        public string Description { get; set; }

        public decimal UnitPrice { get; set; }
    }
    public class CreateProductDto
    {
        public int ID { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }

        public decimal UnitPrice { get; set; }
    }
}
