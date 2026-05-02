using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.CustomerDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IProductService
    {
        Task<ResponseDataModel<CreateProductDto>> CreateProductAsync(CreateProductDto product, CancellationToken cancellationToken);

        Task<ResponseDataModel<PagedResponse<ProductDto>>> GetAllProductAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task<ResponseDataModel<List<ProductDto>>> GetAllProductListAsync( CancellationToken cancellationToken);
        Task<ResponseDataModel<ProductDto>> GetProductByIdAsync(int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<UpdateProductDto>> UpdateProductAsync(int id, UpdateProductDto customer, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeleteProductAsync(int id, CancellationToken cancellationToken);
    }
}
