using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.EmployeeDto
{
    public class EmployeeDto
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public decimal Salary { get; set; }

        public string Documents { get; set; }  // e.g., file paths or document references
    }
         public class CreateEmployeeDto
    {

        public string Name { get; set; }
        public decimal Salary { get; set; }

        public string Documents { get; set; }
    }

    public class UpdateEmployeeDto {

        public int ID { get; set; }
        public string Name { get; set; }
        public decimal Salary { get; set; }
        public string Documents { get; set; }

    }
}
