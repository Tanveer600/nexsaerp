using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PurchaseDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.SalesOutput;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IPurchaseOrderService
    {
        Task<ResponseDataModel<PurchaseOrderResponseDto>> CreatePurchaseOrderAsync(PurchaseOrderRequestDto request, CancellationToken cancellationToken);
         Task<ResponseDataModel<List<PurchaseOrderResponseDto>>> GetAllPurchaseListAsync(CancellationToken cancellationToken);
        Task<ResponseDataModel<PagedResponse<PurchaseOrderResponseDto>>> GetAllPurchaseOrdersAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task<ResponseDataModel<PurchaseOrderResponseDto>> GetPurchaseOrderByIdAsync(int id, CancellationToken cancellationToken);
        Task<ResponseDataModel<PurchaseOrderResponseDto>> UpdatePurchaseOrderAsync(PurchaseOrderRequestDto request, CancellationToken cancellationToken);
        Task<ResponseDataModel<bool>> DeletePurchaseOrderAsync(int id, CancellationToken cancellationToken);
        Task<ResponseDataModel<PurchaseOrderResponseDto>> ConvertQuotationToPurchaseAsync(int vendorQuotationId, CancellationToken cancellationToken);
    }
}
