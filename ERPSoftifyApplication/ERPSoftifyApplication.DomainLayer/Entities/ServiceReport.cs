using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class ServiceReport: IMustHaveTenant
    {
        public int ID { get; set; }

        public int JobId { get; set; }

        public string NotesBefore { get; set; }

        public string NotesAfter { get; set; }

        public string CustomerSignature { get; set; } // e.g., Base64 image or file path

        public DateTime Date { get; set; }

        public int TenantId { get; set; }

        public int BranchId { get; set; }
    }
}
