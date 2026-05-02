using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IVendorInterface
    {
        Task<List<Vendor>> GetAll(CancellationToken can);
        Task<Vendor> GetById(int Id, CancellationToken can);
        Task<bool> DeleteVendor(int Id, CancellationToken can);
        Task<Vendor> UpDateVendor(Vendor model, CancellationToken can);
        Task<Vendor> Create(Vendor model, CancellationToken can);
    }
}
