using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.SalesOutput;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface ISaleService
    {
        Task<ResponseDataModel<SaleViewDto>> CreateSaleAsync(CreateSaleRequest request, CancellationToken cancellationToken);

        Task<ResponseDataModel<PagedResponse<SaleViewDto>>> GetAllSalesAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task<ResponseDataModel<List<SaleViewDto>>> GetAllSaleListAsync(CancellationToken cancellationToken);
        Task<ResponseDataModel<SaleViewDto>> GetSaleByIdAsync(int id, CancellationToken cancellationToken);


        Task<ResponseDataModel<SaleViewDto>> UpdateSaleAsync(UpdateSaleRequest request, CancellationToken cancellationToken);
        Task<ResponseDataModel<SaleViewDto>> ConvertQuotationToSaleAsync(int quotationId, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeleteSaleAsync(int id, CancellationToken cancellationToken);
    }
}
