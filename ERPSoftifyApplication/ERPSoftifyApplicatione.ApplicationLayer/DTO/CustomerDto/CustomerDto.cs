using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.CustomerDto
{
    public class CustomerDto
    {

        public int ID { get; set; }
        public string Name { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string Address { get; set; }

     
    }
    public class CreateCustomerDto
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
       
    }
     public class UpdateCustomerDto
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
    }
}
