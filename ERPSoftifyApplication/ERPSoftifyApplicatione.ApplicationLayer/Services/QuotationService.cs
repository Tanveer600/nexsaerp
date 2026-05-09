using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.Quotation;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class QuotationService : IQuotationService
    {
        private readonly IQuotationInterface _repository;
        private readonly ICurrentUserService _currentUserService;
        private readonly ICustomerService _customerService;

        public QuotationService(IQuotationInterface repository, ICurrentUserService currentUserService, ICustomerService customerService)
        {
            _repository = repository;
            _currentUserService = currentUserService;
            _customerService = customerService;
        }
        public async Task<string> GenerateNextQuotationNumberAsync(CancellationToken cancellationToken)
        {
            var allQuotations = await _repository.GetAllAsync(cancellationToken);
            string prefix = $"QT-{DateTime.Now.Year}-";
            int nextNumber = 1;

            var lastQuotation = allQuotations
                .Where(q => q.QuotationNumber != null && q.QuotationNumber.StartsWith(prefix))
                .OrderByDescending(q => q.QuotationNumber)
                .FirstOrDefault();

            if (lastQuotation != null)
            {
                string lastPart = lastQuotation.QuotationNumber.Replace(prefix, "");
                if (int.TryParse(lastPart, out int lastVal))
                {
                    nextNumber = lastVal + 1;
                }
            }

            return $"{prefix}{nextNumber:D4}";
        }

        public async Task<ResponseDataModel<QuotationViewDto>> CreateQuotationAsync(CreateQuotationRequest request, CancellationToken cancellationToken)
        {
            try
            {

                string nextQuoNumber = await GenerateNextQuotationNumberAsync(cancellationToken);
                var orderEntity = new Quotation
                {
                    CustomerId = request.CustomerId,
                    Status = request.Status,
                    QuotationNumber = nextQuoNumber,
                    ValidUntil = request.ValidUntil,
                    Date = request.QuotationDate,
                    BranchId = _currentUserService.BranchId,
                    TenantId = _currentUserService.TenantId,
                    SubTotal = request.SubTotal,
                    TotalDiscount = request.TotalDiscount,
                    TotalTax = request.TotalTax,
                    NetAmount = request.NetAmount,

                    QuotationItems = request.Items.Select(i => new QuotationItem
                    {
                        ProductId = i.ProductId,
                        QuotationId = i.Quantity,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        DiscountAmount = i.DiscountAmount,
                        TaxAmount = i.TaxAmount,
                        DiscountPercentage = i.DiscountPercentage,
                        TaxPercentage = i.TaxPercentage,
                        LineTotal = (i.Quantity * i.UnitPrice - i.Discount) + i.TaxAmount,
                        TenantId = _currentUserService.TenantId,
                        BranchId = _currentUserService.BranchId,
                    }).ToList()
                };

                var result = await _repository.CreateAsync(orderEntity, cancellationToken);

                var responseDto = new QuotationViewDto
                {
                    QuotationId = result.ID,
                    CustomerId = result.CustomerId,
                    QuotationDate = result.Date,                    
                    CustomerName = result.Customer?.Name,
                    Status = result.Status,
                    Items = result.QuotationItems.Select(item => new QuotationItemViewDto
                    {
                        ItemId = item.ID,
                        ProductId = item.ProductId,
                        ProductName = item.Product?.Name,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        DiscountPercentage=item.DiscountPercentage,
                        DiscountAmount = item.DiscountAmount,
                        TaxAmount = item.TaxAmount,
                        TaxPercentage=item.TaxPercentage
                    }).ToList()
                };

                return ResponseDataModel<QuotationViewDto>.SuccessResponse(responseDto, "Created Successfully");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<QuotationViewDto>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<bool>> DeleteQuotationAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await _repository.DeleteAsync(id, cancellationToken);
                return deleted
                    ? ResponseDataModel<bool>.SuccessResponse(true, "Deleted")
                    : ResponseDataModel<bool>.FailureResponse("Failed to delete");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<bool>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<PagedResponse<QuotationViewDto>>> GetAllQuotationsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            try
            {
                var allOrders = await _repository.GetAllAsync(cancellationToken);
                var totalCount = allOrders.Count();

                var paginatedOrders = allOrders
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                var mappedItems = paginatedOrders.Select(o => new QuotationViewDto
                {

                    QuotationId = o.ID,
                    CustomerId = o.CustomerId,
                    CustomerName = o.Customer.Name,
                    ValidUntil=o.ValidUntil,
                    Status = o.Status,
                    QuotationDate = o.Date,
                    Items = o.QuotationItems.Select(i => new QuotationItemViewDto
                    {
                        ItemId = i.ID,
                        ProductId = i.ProductId,
                        ProductName = i.Product?.Name,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        DiscountAmount = i.DiscountAmount,
                        TaxAmount = i.TaxAmount,
                        DiscountPercentage = i.DiscountPercentage,
                        TaxPercentage = i.TaxPercentage,
                    }).ToList()
                }).ToList();

                var pagedData = new PagedResponse<QuotationViewDto>
                {
                    TotalCount = totalCount,
                    Page = pageNumber,
                    PageSize = pageSize,
                    Items = mappedItems
                };

                return ResponseDataModel<PagedResponse<QuotationViewDto>>.SuccessResponse(pagedData);
            }
            catch (Exception ex)
            {
                return ResponseDataModel<PagedResponse<QuotationViewDto>>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<QuotationViewDto>> GetQuotationByIdAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var order = await _repository.GetByIdAsync(id, cancellationToken);
                if (order == null) return ResponseDataModel<QuotationViewDto>.FailureResponse("Not Found");

                var responseDto = new QuotationViewDto
                {
                    QuotationId = order.ID,
                    CustomerId = order.CustomerId,
                    CustomerName = order.Customer?.Name,
                    Status = order.Status,
                    QuotationDate = order.Date,
                    ValidUntil= order.ValidUntil,
                    TotalDiscount = order.TotalDiscount,
                    SubTotal = order.SubTotal,
                    TotalTax = order.TotalTax,
                    NetAmount = order.NetAmount,
                    Items = order.QuotationItems.Select(i => new QuotationItemViewDto
                    {
                        ItemId = i.ID,
                        ProductId = i.ProductId,
                        ProductName = i.Product?.Name,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        DiscountAmount = i.DiscountAmount,
                        TaxAmount = i.TaxAmount
                    }).ToList()
                };

                return ResponseDataModel<QuotationViewDto>.SuccessResponse(responseDto);
            }
            catch (Exception ex)
            {
                return ResponseDataModel<QuotationViewDto>.FailureResponse(ex.Message);
            }
        }
       
        public async Task<ResponseDataModel<QuotationViewDto>> UpdateQuotationAsync(UpdateQuotationRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var orderToUpdate = new Quotation
                {
                    ID = request.QuotationId,
                    CustomerId = request.CustomerId,
                    Status = request.Status,
                    Date = request.QuotationDate,
                    ValidUntil = request.ValidUntil,
                    BranchId = _currentUserService.BranchId,
                    TenantId = _currentUserService.TenantId,
                    SubTotal = request.SubTotal,
                    TotalDiscount = request.TotalDiscount,
                    TotalTax = request.TotalTax,
                    NetAmount = request.NetAmount,

                    QuotationItems = request.Items.Select(i => new QuotationItem
                    {
                        ID = i.ID ?? 0,
                        QuotationId = request.QuotationId,
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        DiscountAmount = i.DiscountAmount,
                        DiscountPercentage = i.DiscountPercentage,
                        TaxPercentage = i.TaxPercentage,
                        TaxAmount = i.TaxAmount,
                        BranchId = _currentUserService.BranchId,
                        TenantId = _currentUserService.TenantId,
                    }).ToList()
                };

                var result = await _repository.UpdateAsync(orderToUpdate, cancellationToken);

                var responseDto = new QuotationViewDto
                {
                    QuotationId = result.ID,
                    CustomerId = result.CustomerId,
                    Status = result.Status,
                    ValidUntil= result.ValidUntil,
                    QuotationDate = result.Date,
                    Items = result.QuotationItems.Select(item => new QuotationItemViewDto
                    {
                        ItemId = item.ID,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        DiscountAmount = item.DiscountAmount,
                        TaxAmount = item.TaxAmount
                    }).ToList()
                };


                return ResponseDataModel<QuotationViewDto>.SuccessResponse(responseDto, "Updated Successfully");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<QuotationViewDto>.FailureResponse(ex.Message);
            }
        }
    }
}