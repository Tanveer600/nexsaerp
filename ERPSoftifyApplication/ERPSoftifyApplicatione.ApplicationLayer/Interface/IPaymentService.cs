using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PaymentDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IPaymentService
    {
        Task<ResponseDataModel<CreatePaymentDto>> CreatePaymentAsync(CreatePaymentDto Payment, CancellationToken cancellationToken);
        Task<ResponseDataModel<List<PaymentDto>>> GetAllPaymentListAsync(CancellationToken cancellationToken);
        Task<ResponseDataModel<PagedResponse<PaymentDto>>> GetAllPaymentAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task<ResponseDataModel<PaymentDto>> GetPaymentByIdAsync(int id, CancellationToken cancellationToken);
        Task<ResponseDataModel<UpdatePaymentDto>> UpdatePaymentAsync(int id, UpdatePaymentDto Payment, CancellationToken cancellationToken);
        Task<ResponseDataModel<bool>> DeletePaymentAsync(int id, CancellationToken cancellationToken);
    }
}
