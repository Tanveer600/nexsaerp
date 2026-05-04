using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PurchaseDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.QuotationOutput;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public  interface IQuotationService
    {
        Task<ResponseDataModel<QuotationResponseDto>> CreateQuotationAsync(QuotationRequestDto request, CancellationToken cancellationToken);

        Task<ResponseDataModel<PagedResponse<QuotationResponseDto>>> GetAllQuotationsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);

        Task<ResponseDataModel<QuotationResponseDto>> GetQuotationByIdAsync(int id, CancellationToken cancellationToken);

       
        Task<ResponseDataModel<QuotationResponseDto>> UpdateQuotationAsync(QuotationRequestDto request, CancellationToken cancellationToken);

        
        Task<ResponseDataModel<bool>> DeleteQuotationAsync(int id, CancellationToken cancellationToken);
    }
}
