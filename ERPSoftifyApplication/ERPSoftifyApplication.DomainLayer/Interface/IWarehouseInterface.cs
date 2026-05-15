using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IWarehouseInterface
    {
        Task<List<Warehouse>> GetAll(CancellationToken can);
        Task<Warehouse> GetById(int Id, CancellationToken can);
        Task<bool> DeleteWarehouse(int Id, CancellationToken can);
        Task<Warehouse> UpDateWarehouse(Warehouse model, CancellationToken can);
        Task<Warehouse> CreateWarehouse(Warehouse model, CancellationToken can);
    }
}
