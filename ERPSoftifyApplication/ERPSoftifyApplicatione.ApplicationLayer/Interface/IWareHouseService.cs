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

        Task<ResponseDataModel<PagedResponse<WarehouseUpdateDto>>> GetAllWarehouseAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task<ResponseDataModel<List<WarehouseOutputDto>>> GetAllWarehouseListAsync(CancellationToken cancellationToken);
        Task<ResponseDataModel<WarehouseOutputDto>> GetWarehouseByIdAsync(int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<WarehouseUpdateDto>> UpdateWarehouseAsync(int id, WarehouseUpdateDto customer, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeleteWarehouseAsync(int id, CancellationToken cancellationToken);
    }
}
