using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.InvoiceDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IInvoiceInterface _invoiceInterface;
        private readonly ICurrentUserService _currentUserService;

        public InvoiceService(IInvoiceInterface invoiceInterface, ICurrentUserService currentUserService)
        {
            _invoiceInterface = invoiceInterface;
            _currentUserService = currentUserService;
        }

        public async Task<ResponseDataModel<CreateInvoiceOutPutDto>> CreateInvoiceAsync(CreateInvoiceOutPutDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var tenantId = _currentUserService.TenantId;
                var branchId = _currentUserService.BranchId > 0 ? _currentUserService.BranchId : dto.BranchId;

                var invoice = new Invoice
                {
                    SalesOrderId = dto.SalesOrderId,
                    Date = dto.Date == default ? DateTime.UtcNow : dto.Date,
                    TotalAmount = dto.TotalAmount,
                    VAT = dto.VAT,
                    PaymentStatus = dto.PaymentStatus,
                    TenantId = tenantId,
                    BranchId = branchId,
                    Items = dto.Items.Select(i => new InvoiceItems
                    {
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        TenantId = tenantId
                    }).ToList()
                };

                var result = await _invoiceInterface.CreateInvoice(invoice, cancellationToken);
                var responseData = new CreateInvoiceOutPutDto
                {
                    SalesOrderId = result.SalesOrderId,
                    Date = result.Date,
                    TotalAmount = result.TotalAmount,
                    VAT = result.VAT,
                    PaymentStatus = result.PaymentStatus,
                    TenantId = result.TenantId,
                    BranchId = result.BranchId,
                    Items = result.Items.Select(i => new CreateInvoiceItemOutPutDto
                    {
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        TenantId = i.TenantId
                    }).ToList()
                };

                return ResponseDataModel<CreateInvoiceOutPutDto>.SuccessResponse(responseData, "Invoice created successfully");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<CreateInvoiceOutPutDto>.FailureResponse($"Database Error: {ex.Message}");
            }
        }

        public async Task<ResponseDataModel<PagedResponse<InvoiceOutPutDto>>> GetAllInvoicesAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = await _invoiceInterface.GetAll(cancellationToken);

            var totalCount = query.Count();

            var invoices = query.OrderByDescending(x => x.ID)
                               .Skip((pageNumber - 1) * pageSize)
                               .Take(pageSize)
                               .Select(inv => new InvoiceOutPutDto
                               {
                                   ID = inv.ID,
                                   SalesOrderId = inv.SalesOrderId,
                                   Date = inv.Date,
                                   TotalAmount = inv.TotalAmount,
                                   VAT = inv.VAT,
                                   PaymentStatus = inv.PaymentStatus,
                                   TenantId = inv.TenantId,
                                   BranchId = inv.BranchId,
                                   Items = inv.Items.Select(i => new InvoiceItemOutPutDto
                                   {
                                       ID = i.ID,
                                       InvoiceId = i.InvoiceId,
                                       ProductId = i.ProductId,
                                       Quantity = i.Quantity,
                                       UnitPrice = i.UnitPrice,
                                       TenantId = i.TenantId
                                   }).ToList()
                               }).ToList();

            var pagedData = new PagedResponse<InvoiceOutPutDto>
            {
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize,
                Items = invoices
            };

            return ResponseDataModel<PagedResponse<InvoiceOutPutDto>>.SuccessResponse(pagedData);
        }

        public async Task<ResponseDataModel<List<InvoiceOutPutDto>>> GetInvoiceListAsync(CancellationToken cancellationToken)
        {
            var query = await _invoiceInterface.GetAll(cancellationToken);

            var invoices = query.Select(inv => new InvoiceOutPutDto
            {
                ID = inv.ID,
                SalesOrderId = inv.SalesOrderId,
                Date = inv.Date,
                TotalAmount = inv.TotalAmount,
                VAT = inv.VAT,
                PaymentStatus = inv.PaymentStatus,
                TenantId = inv.TenantId,
                BranchId = inv.BranchId
            }).ToList();

            return ResponseDataModel<List<InvoiceOutPutDto>>.SuccessResponse(invoices);
        }

        public async Task<ResponseDataModel<InvoiceOutPutDto>> GetInvoiceByIdAsync(int id, CancellationToken cancellationToken)
        {
            var invoice = await _invoiceInterface.GetById(id, cancellationToken);

            if (invoice == null)
                return ResponseDataModel<InvoiceOutPutDto>.FailureResponse("Invoice not found");

            var dto = new InvoiceOutPutDto
            {
                ID = invoice.ID,
                SalesOrderId = invoice.SalesOrderId,
                Date = invoice.Date,
                TotalAmount = invoice.TotalAmount,
                VAT = invoice.VAT,
                PaymentStatus = invoice.PaymentStatus,
                TenantId = invoice.TenantId,
                BranchId = invoice.BranchId,
                Items = invoice.Items.Select(i => new InvoiceItemOutPutDto
                {
                    ID = i.ID,
                    InvoiceId = i.InvoiceId,
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TenantId = i.TenantId
                }).ToList()
            };

            return ResponseDataModel<InvoiceOutPutDto>.SuccessResponse(dto);
        }

        public async Task<ResponseDataModel<InvoiceOutPutDto>> UpdateInvoiceAsync(int id, InvoiceOutPutDto dto, CancellationToken cancellationToken)
        {
            var existing = await _invoiceInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<InvoiceOutPutDto>.FailureResponse("Invoice not found");

            existing.PaymentStatus = dto.PaymentStatus;
            existing.Date = dto.Date;
            existing.SalesOrderId = dto.SalesOrderId;
            existing.VAT = dto.VAT;
            existing.TotalAmount = dto.TotalAmount;
            existing.BranchId = dto.BranchId;
            if (dto.Items != null)
            {
                existing.Items = dto.Items.Select(i => new InvoiceItems
                {
                    ID = i.ID,
                    InvoiceId = existing.ID,
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TenantId = _currentUserService.TenantId
                }).ToList();
            }

            await _invoiceInterface.UpDateInvoice(existing, cancellationToken);

            return ResponseDataModel<InvoiceOutPutDto>.SuccessResponse(dto, "Invoice updated successfully");
        }

        public async Task<ResponseDataModel<bool>> DeleteInvoiceAsync(int id, CancellationToken cancellationToken)
        {
            var existing = await _invoiceInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<bool>.FailureResponse("Invoice not found");

            await _invoiceInterface.DeleteInvoice(existing.ID, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(true, "Invoice deleted successfully");
        }
    }
}