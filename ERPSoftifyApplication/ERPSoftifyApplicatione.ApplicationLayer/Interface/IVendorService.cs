using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.VendorDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IVendorService
    {
        Task<ResponseDataModel<CreateVendorDto>> CreateVendorAsync(CreateVendorDto Vendor, CancellationToken cancellationToken);

        Task<ResponseDataModel<List<VendorDto>>> GetAllVendorListAsync(CancellationToken cancellationToken);
        Task<ResponseDataModel<PagedResponse<VendorDto>>> GetAllVendorAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task<ResponseDataModel<VendorDto>> GetVendorByIdAsync(int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<UpdateVendorDto>> UpdateVendorAsync(int id, UpdateVendorDto Vendor, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeleteVendorAsync(int id, CancellationToken cancellationToken);
    }
}
