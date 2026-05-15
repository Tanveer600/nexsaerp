using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.WarehouseDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IWareHouseService
    {
        Task<ResponseDataModel<WarehouseCreateDto>> CreateWarehouseAsync(WarehouseCreateDto product, CancellationToken cancellationToken);

        Task<ResponseDataModel<PagedResponse<WarehouseOutputDto>>> GetAllWarehouseAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task<ResponseDataModel<List<Warehouse>>> GetAllWarehouseListAsync(CancellationToken cancellationToken);
        Task<ResponseDataModel<Warehouse>> GetWarehouseByIdAsync(int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<Warehouse>> UpdateWarehouseAsync(int id, Warehouse customer, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeleteWarehouseAsync(int id, CancellationToken cancellationToken);
    }
}
