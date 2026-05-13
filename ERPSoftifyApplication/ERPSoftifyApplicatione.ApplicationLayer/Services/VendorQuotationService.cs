using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.Quotation;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.VendorQuotatinOutput;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class VendorQuotationService : IVendorQuotationService
    {
        private readonly IVendorQuotationInterface _repository;
        private readonly ICurrentUserService _currentUserService;

        public VendorQuotationService(IVendorQuotationInterface repository, ICurrentUserService currentUserService)
        {
            _repository = repository;
            _currentUserService = currentUserService;
        }

        public async Task<string> GenerateNextVendorQuotationNumberAsync(CancellationToken cancellationToken)
        {
            var allVendorQuotations = await _repository.GetAllAsync(cancellationToken);
            string prefix = $"VQ-{DateTime.Now.Year}-";
            int nextNumber = 1;

            var lastVendorQuotation = allVendorQuotations
                .Where(q => q.VQNumber != null && q.VQNumber.StartsWith(prefix))
                .OrderByDescending(q => q.VQNumber)
                .FirstOrDefault();

            if (lastVendorQuotation != null)
            {
                string lastPart = lastVendorQuotation.VQNumber.Replace(prefix, "");
                if (int.TryParse(lastPart, out int lastVal))
                {
                    nextNumber = lastVal + 1;
                }
            }

            return $"{prefix}{nextNumber:D4}";
        }

        public async Task<ResponseDataModel<VendorQuotationViewDto>> CreateVendorQuotationAsync(CreateVendorQuotationRequest request, CancellationToken cancellationToken)
        {
            try
            {
                string nextQuoNumber = await GenerateNextVendorQuotationNumberAsync(cancellationToken);
                var orderEntity = new VendorQuotation
                {
                    VendorId = request.VendorId,
                    Status = request.Status,
                    VQNumber = nextQuoNumber,
                    QuotationDate = request.QuotationDate,
                    ValidUntil = request.ValidUntil,
                    CurrencyCode = request.CurrencyCode,
                    ExchangeRate = request.ExchangeRate,
                    TotalDiscount = request.TotalDiscount,

                    TotalTax = request.TotalTax,
                    NetAmount = request.NetAmount,
                    BranchId = _currentUserService.BranchId,
                    TenantId = _currentUserService.TenantId,

                    Items = request.Items.Select(i => new VendorQuotationItem
                    {
                        VQId = i.VQId,
                        Quantity = i.Quantity,
                        ProductId = i.ProductId,
                        UnitPrice = i.UnitPrice,
                        DiscountPercentage = i.DiscountPercentage,
                        DiscountAmount = i.DiscountAmount,
                        TaxPercentage = i.TaxPercentage,
                        TaxAmount = i.TaxAmount,
                        LineTotal = i.LineTotal,
                        TenantId = _currentUserService.TenantId,
                        BranchId = _currentUserService.BranchId,
                    }).ToList()
                };

                var result = await _repository.CreateAsync(orderEntity, cancellationToken);
                var responseDto = new VendorQuotationViewDto
                {
                    VQId = result.ID,
                    VendorId = result.VendorId,
                    VQNumber = result.VQNumber,
                    Status = result.Status,
                   

                };

                return ResponseDataModel<VendorQuotationViewDto>.SuccessResponse(responseDto, "Created Successfully");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<VendorQuotationViewDto>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<VendorQuotationViewDto>> GetVendorQuotationByIdAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var order = await _repository.GetByIdAsync(id, cancellationToken);
                if (order == null) return ResponseDataModel<VendorQuotationViewDto>.FailureResponse("Not Found");

                var responseDto = new VendorQuotationViewDto
                {
                    VQId = order.ID,
                    VendorId = order.VendorId,
                    VendorName = order.Vendor?.Name,
                    Status = order.Status,
                    VQNumber = order.VQNumber,
                    QuotationDate = order.QuotationDate,
                    ValidUntil = order.ValidUntil,
                    TotalDiscount = order.TotalDiscount,
                    TotalTax = order.TotalTax,
                    NetAmount = order.NetAmount,
                    
                    Items = order.Items.Select(i => new VendorQuotationItemViewDto
                    {
                        ID=i.ID,
                        VQId = i.VQId,
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Discount = i.DiscountAmount,
                        TaxPercentage = i.TaxPercentage,
                        TaxAmount = i.TaxAmount,
                        DiscountPercentage=i.DiscountPercentage,
                        LineTotal = i.LineTotal,
                        TenantId = i.TenantId,
                        BranchId = i.BranchId
                    }).ToList()
                };

                return ResponseDataModel<VendorQuotationViewDto>.SuccessResponse(responseDto);
            }
            catch (Exception ex)
            {
                return ResponseDataModel<VendorQuotationViewDto>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<PagedResponse<VendorQuotationViewDto>>> GetAllVendorQuotationsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            try
            {
                var allOrders = await _repository.GetAllAsync(cancellationToken);
                var totalCount = allOrders.Count();

                var paginatedOrders = allOrders
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var mappedItems = paginatedOrders.Select(o => new VendorQuotationViewDto
                {
                    ID = o.ID,
                    VendorId = o.VendorId,
                    VendorName = o.Vendor?.Name,
                    VQNumber = o.VQNumber,
                    QuotationDate = o.QuotationDate,
                    ValidUntil = o.ValidUntil,
                    SubTotal=o.SubTotal,
                    CurrencyCode =o.CurrencyCode,
                    GrandTotal = o.SubTotal - o.TotalDiscount + o.TotalTax,
                    NetAmount = o.NetAmount,
                    TotalDiscount= o.TotalDiscount,
                    TotalTax= o.TotalTax,
                    Status = o.Status,
                     Items = o.Items.Select(i => new VendorQuotationItemViewDto
                     {
                         VQId = i.ID,
                         ProductId = i.ProductId,
                         ProductName = i.Product?.Name,
                         Quantity = i.Quantity,
                         UnitPrice = i.UnitPrice,
                         Discount = i.DiscountAmount,
                         TaxAmount = i.TaxAmount,
                         DiscountPercentage = i.DiscountPercentage,
                         TaxPercentage = i.TaxPercentage,
                         LineTotal=i.LineTotal,

                     }).ToList()
                }).ToList();

                var pagedData = new PagedResponse<VendorQuotationViewDto>
                {
                    TotalCount = totalCount,
                    Page = pageNumber,
                    PageSize = pageSize,
                    Items = mappedItems
                };

                return ResponseDataModel<PagedResponse<VendorQuotationViewDto>>.SuccessResponse(pagedData);
            }
            catch (Exception ex)
            {
                return ResponseDataModel<PagedResponse<VendorQuotationViewDto>>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<bool>> DeleteVendorQuotationAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var deleted = await _repository.DeleteAsync(id, cancellationToken);
                return deleted
                    ? ResponseDataModel<bool>.SuccessResponse(true, "Deleted Successfully")
                    : ResponseDataModel<bool>.FailureResponse("Failed to delete");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<bool>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<VendorQuotationViewDto>> UpdateVendorQuotationAsync(UpdateVendorQuotationRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var orderToUpdate = new VendorQuotation
                {
                   
                    ID = request.VendorQuotationId,
                    VendorId = request.VendorId,
                    Status = request.Status,
                    VQNumber = request.VQNumber,
                    QuotationDate = request.QuotationDate,
                    ValidUntil = request.ValidUntil,
                    CurrencyCode = request.CurrencyCode, 
                    ExchangeRate = request.ExchangeRate, 
                    TotalDiscount = request.TotalDiscount,
                    TotalTax = request.TotalTax,
                    NetAmount = request.NetAmount,
                    BranchId = _currentUserService.BranchId,
                    TenantId = _currentUserService.TenantId,

                    Items = request.Items.Select(i => new VendorQuotationItem
                    {
                        VQId = request.VendorQuotationId,
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        DiscountPercentage = i.DiscountPercentage,
                        DiscountAmount = i.DiscountAmount,
                        TaxPercentage = i.TaxPercentage,
                        TaxAmount = i.TaxAmount,
                        LineTotal = (i.Quantity * i.UnitPrice - i.DiscountAmount) + i.TaxAmount,
                        BranchId = _currentUserService.BranchId,
                        TenantId = _currentUserService.TenantId,
                    }).ToList()
                };

                await _repository.UpdateAsync(orderToUpdate, cancellationToken);
                return ResponseDataModel<VendorQuotationViewDto>.SuccessResponse(null, "Updated Successfully");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<VendorQuotationViewDto>.FailureResponse(ex.Message);
            }
        }
    }
}