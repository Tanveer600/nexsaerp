using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PaymentDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class PaymentService:IPaymentService
    {
        private readonly IPaymentInterface _PaymentInterface;
        private readonly ICurrentUserService _currentUserService;
        private readonly IInvoiceInterface _invoiceInterface;
        public PaymentService(IPaymentInterface PaymentInterface, ICurrentUserService currentUserService, IInvoiceInterface invoiceInterface)
        {
            _PaymentInterface = PaymentInterface;
            _currentUserService = currentUserService;
            _invoiceInterface = invoiceInterface;
        }

        public async Task<ResponseDataModel<CreatePaymentDto>> CreatePaymentAsync(CreatePaymentDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var invoice = await _invoiceInterface.GetById(dto.InvoiceId, cancellationToken);
                if (invoice == null)
                {
                    return ResponseDataModel<CreatePaymentDto>.FailureResponse("Targeted Invoice not found.");
                }

                var payment = new Payment
                {
                    ID = 0,
                    Amount = dto.Amount,
                    Date = dto.Date,
                    Status = dto.Status,
                    Mode = dto.Mode,
                    InvoiceId = dto.InvoiceId,
                    BranchId = _currentUserService.BranchId,
                    TenantId = _currentUserService.TenantId,
                };

                var result = await _PaymentInterface.Create(payment, cancellationToken);

                string targetStatus = "Pending";
                switch (dto.Status)
                {
                    case "Paid":
                        targetStatus = "Paid";
                        break;
                    case "Pending":
                        targetStatus = "Pending";
                        break;
                    case "Failed":
                        targetStatus = "Pending";
                        break;
                    default:
                        targetStatus = "Pending";
                        break;
                }

                await _invoiceInterface.UpdateInvoiceStatusAsync(dto.InvoiceId, targetStatus, cancellationToken);

                dto.ID = result.ID;
                return ResponseDataModel<CreatePaymentDto>.SuccessResponse(dto, "Payment processed and Invoice workflow status reconciled successfully.");
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : "No inner exception";
                return ResponseDataModel<CreatePaymentDto>.FailureResponse($"Error: {ex.Message} | InnerError: {innerMessage}");
            }
        }
        public async Task<ResponseDataModel<List<PaymentDto>>> GetAllPaymentListAsync(CancellationToken cancellationToken)
        {
            var query = await _PaymentInterface.GetAll(cancellationToken);

            var totalCount = query.Count();

            var Products = query.Select(b => new PaymentDto
            {
                ID = b.ID,
                Mode = b.Mode,
            }).ToList();


            return ResponseDataModel<List<PaymentDto>>.SuccessResponse(Products);

        }
        public async Task<ResponseDataModel<PagedResponse<PaymentDto>>> GetAllPaymentAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = await _PaymentInterface.GetAll(cancellationToken);

            var totalCount = query.Count();

            var Payments = query.OrderByDescending(x => x.ID).Skip((pageNumber - 1) * pageSize).Take(pageSize)
                           .Select(dto => new PaymentDto
                           {
                               ID = dto.ID,
                               Amount = dto.Amount,
                               Date = dto.Date,
                               Status = dto.Status,
                               Mode = dto.Mode,
                               InvoiceId = dto.InvoiceId,
                               BranchId = _currentUserService.BranchId,
                               TenantId = _currentUserService.TenantId,
                           }).ToList();

            var pagedData = new PagedResponse<PaymentDto>
            {
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize,
                Items = Payments
            };

            return ResponseDataModel<PagedResponse<PaymentDto>>.SuccessResponse(pagedData);
        }

        public async Task<ResponseDataModel<PaymentDto>> GetPaymentByIdAsync(int id, CancellationToken cancellationToken)
        {
            var Payment = await _PaymentInterface.GetById(id, cancellationToken);

            if (Payment == null)
                return ResponseDataModel<PaymentDto>.FailureResponse("Payment not found");

            var dto = new PaymentDto
            {
                Amount = Payment.Amount,
                Date = Payment.Date,
                Status = Payment.Status,
                Mode = Payment.Mode,
                InvoiceId = Payment.InvoiceId,
                BranchId = Payment.BranchId,               
                TenantId = Payment.TenantId,

            };

            return ResponseDataModel<PaymentDto>.SuccessResponse(dto);
        }

        public async Task<ResponseDataModel<UpdatePaymentDto>> UpdatePaymentAsync(int id, UpdatePaymentDto dto, CancellationToken cancellationToken)
        {
            var existing = await _PaymentInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<UpdatePaymentDto>.FailureResponse("Payment not found");
            existing.ID = dto.ID;
            existing.Status = dto.Status;
            existing.Date = dto.Date;
            existing.Mode = dto.Mode;
            existing.Amount = dto.Amount;
            existing.InvoiceId = dto.InvoiceId;
            existing.TenantId = dto.InvoiceId;
            existing.BranchId = dto.BranchId;

            await _PaymentInterface.UpDatePayment(existing, cancellationToken);

            return ResponseDataModel<UpdatePaymentDto>.SuccessResponse(dto, "Payment updated successfully");
        }


        public async Task<ResponseDataModel<bool>> DeletePaymentAsync(int id, CancellationToken cancellationToken)
        {
            var existing = await _PaymentInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<bool>.FailureResponse("Payment not found");



            await _PaymentInterface.DeletePayment(existing.ID, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(true, "Payment deleted successfully");
        }
    }
}
