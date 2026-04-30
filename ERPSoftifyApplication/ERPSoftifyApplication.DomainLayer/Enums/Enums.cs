using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Enums
{

    public enum RecordStatus
    {
        Active = 1,   
        Inactive = 2,   
        Deleted = 3,    
        Archived = 4    
    }

    public enum DbOperation
    {
        Create = 1,
        Update = 2,
        Delete = 3,
        View = 4
    }
}
