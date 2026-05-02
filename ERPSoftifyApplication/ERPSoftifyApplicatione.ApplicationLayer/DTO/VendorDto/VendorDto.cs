using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.VendorDto
{
    public class VendorDto
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public string Contact { get; set; }

        public string Address { get; set; }

    }
    public class CreateVendorDto
    {

        public string Name { get; set; }

        public string Contact { get; set; }

        public string Address { get; set; }

    }
    public class UpdateVendorDto
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public string Contact { get; set; }

        public string Address { get; set; }

    }
}
