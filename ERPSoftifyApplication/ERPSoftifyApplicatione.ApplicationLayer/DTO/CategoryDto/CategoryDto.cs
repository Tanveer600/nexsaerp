using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.CategoryDto
{
    public  class CategoryDto
    {

        public int ID { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsActive { get; set; } = true;
       



    }
        public class CreateCategoryDto
        {
      
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsActive { get; set; } = true;
       
    }
        public class UpdateCategoryDto
        {
    
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsActive { get; set; } = true;
       
    }

}

