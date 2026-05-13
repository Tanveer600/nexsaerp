using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.VendorQuotatinOutput;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IVendorQuotationService
    {
        Task<ResponseDataModel<VendorQuotationViewDto>> CreateVendorQuotationAsync(CreateVendorQuotationRequest request, CancellationToken cancellationToken);

        Task<ResponseDataModel<PagedResponse<VendorQuotationViewDto>>> GetAllVendorQuotationsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);

        Task<ResponseDataModel<VendorQuotationViewDto>> GetVendorQuotationByIdAsync(int id, CancellationToken cancellationToken);


        Task<ResponseDataModel<VendorQuotationViewDto>> UpdateVendorQuotationAsync(UpdateVendorQuotationRequest request, CancellationToken cancellationToken);


        Task<ResponseDataModel<bool>> DeleteVendorQuotationAsync(int id, CancellationToken cancellationToken);
    }
}
