using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PurchaseDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.Quotation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public  interface IQuotationService
    {
        Task<ResponseDataModel<QuotationViewDto>> CreateQuotationAsync(CreateQuotationRequest request, CancellationToken cancellationToken);

        Task<ResponseDataModel<PagedResponse<QuotationViewDto>>> GetAllQuotationsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);

        Task<ResponseDataModel<QuotationViewDto>> GetQuotationByIdAsync(int id, CancellationToken cancellationToken);

       
        Task<ResponseDataModel<QuotationViewDto>> UpdateQuotationAsync(UpdateQuotationRequest request, CancellationToken cancellationToken);

        
        Task<ResponseDataModel<bool>> DeleteQuotationAsync(int id, CancellationToken cancellationToken);
    }
}
