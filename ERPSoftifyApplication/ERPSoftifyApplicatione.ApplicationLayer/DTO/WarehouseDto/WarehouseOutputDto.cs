using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.WarehouseDto
{
    public class WarehouseOutputDto
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string ContactPerson { get; set; }
        public string Phone { get; set; }
        public bool IsActive { get; set; }
        public bool IsDefault { get; set; }
    }

    public class WarehouseCreateDto
    {
        public string Name { get; set; }
        public string Location { get; set; }
        public string ContactPerson { get; set; }
        public string Phone { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
    }

    public class WarehouseUpdateDto
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string ContactPerson { get; set; }
        public string Phone { get; set; }
        public bool IsActive { get; set; }
        public bool IsDefault { get; set; }
    }
}