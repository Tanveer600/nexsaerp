using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.InvoiceDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IInvoiceService
    {
        Task<ResponseDataModel<CreateInvoiceOutPutDto>> CreateInvoiceAsync(CreateInvoiceOutPutDto product, CancellationToken cancellationToken);

        Task<ResponseDataModel<PagedResponse<InvoiceOutPutDto>>> GetAllInvoicesAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task<ResponseDataModel<List<InvoiceOutPutDto>>> GetInvoiceListAsync(CancellationToken cancellationToken);
        Task<ResponseDataModel<InvoiceOutPutDto>> GetInvoiceByIdAsync(int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<InvoiceOutPutDto>> UpdateInvoiceAsync(int id, InvoiceOutPutDto customer, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeleteInvoiceAsync(int id, CancellationToken cancellationToken);
    }
}

