using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PurchaseDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.SalesOutput;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly IPurchaseOrderInterface _repository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IVendorQuotationInterface _quotationRepository;
        private readonly IVendorQuotationInterface _vendorQuotationInterface;
        public PurchaseOrderService(IPurchaseOrderInterface repository, ICurrentUserService currentUserService, IVendorQuotationInterface quotationRepository, IVendorQuotationInterface vendorQuotationInterface)
        {
            _repository = repository;
            _currentUserService = currentUserService;
            _quotationRepository = quotationRepository;
            _vendorQuotationInterface = vendorQuotationInterface;
        }

        public async Task<string> GenerateNextPoNumberAsync(CancellationToken cancellationToken)
        {
            var allOrders = await _repository.GetAllAsync(cancellationToken);
            string prefix = $"PO-{DateTime.Now.Year}-"; // Prefix changed to PO
            int nextNumber = 1;

            var lastOrder = allOrders
                .Where(q => q.PONumber != null && q.PONumber.StartsWith(prefix))
                .OrderByDescending(q => q.PONumber)
                .FirstOrDefault();

            if (lastOrder != null)
            {
                string lastPart = lastOrder.PONumber.Replace(prefix, "");
                if (int.TryParse(lastPart, out int lastVal))
                {
                    nextNumber = lastVal + 1;
                }
            }

            return $"{prefix}{nextNumber:D4}";
        }

        public async Task<ResponseDataModel<PurchaseOrderResponseDto>> CreatePurchaseOrderAsync(PurchaseOrderRequestDto request, CancellationToken cancellationToken)
        {
            try
            {
                string nextPoNumber = await GenerateNextPoNumberAsync(cancellationToken);
                var tenantId = _currentUserService.TenantId;
                var branchId = _currentUserService.BranchId;

                var orderEntity = new PurchaseOrder
                {
                    VendorId = request.VendorId,
                    OrderDate = request.OrderDate,
                    Status = request.Status ?? "Pending",
                    PONumber = nextPoNumber,
                    CurrencyCode = request.CurrencyCode,
                    ExchangeRate = request.ExchangeRate,
                    TotalDiscount = request.TotalDiscount,
                    TotalTax = request.TotalTax,
                    TotalAmount = request.TotalAmount,
                    BranchId = branchId,
                    TenantId = tenantId,
                    Items = request.Items.Select(i => new PurchaseOrderItem
                    {
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Discount = i.Discount,
                        TaxPercentage = i.TaxPercentage,
                        TaxAmount = i.TaxAmount,
                        LineTotal = i.LineTotal,
                        ReceivedQuantity = 0,
                        TenantId = tenantId,
                        BranchId = branchId,
                    }).ToList()
                };

                var result = await _repository.CreateAsync(orderEntity, cancellationToken);

                return await GetPurchaseOrderByIdAsync(result.ID, cancellationToken);
            }
            catch (Exception ex)
            {
                return ResponseDataModel<PurchaseOrderResponseDto>.FailureResponse(ex.Message);
            }
        }
        public async Task<ResponseDataModel<List<PurchaseOrderResponseDto>>> GetAllPurchaseListAsync(CancellationToken cancellationToken)
        {
            var query = await _repository.GetAllAsync(cancellationToken);
            var purchaseOrders = query.Select(b => new PurchaseOrderResponseDto
            {
                ID = b.ID,
                PONumber = b.PONumber,
                CurrencyCode = b.CurrencyCode,
                OrderDate = b.OrderDate,
                VendorName=b.Vendor.Name,
                Status=b.Status,
                ExchangeRate=b.ExchangeRate,
                Items = b.Items.Select(i => new PurchaseOrderItemResponseDto
                {
                    ID = i.ID,
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    ProductName = i.Product.Name,
                    ReceivedQuantity = i.ReceivedQuantity,

                }).ToList()
            }).ToList();


            return ResponseDataModel<List<PurchaseOrderResponseDto>>.SuccessResponse(purchaseOrders);

        }
        public async Task<ResponseDataModel<PagedResponse<PurchaseOrderResponseDto>>> GetAllPurchaseOrdersAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            try
            {
                var allOrders = await _repository.GetAllAsync(cancellationToken);
                var totalCount = allOrders.Count();
                var paginatedOrders = allOrders
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                var mappedItems = paginatedOrders.Select(o => new PurchaseOrderResponseDto
                {
                    ID = o.ID,
                    VendorId = o.VendorId,
                    VendorName = o.Vendor?.Name ?? "N/A",
                    PONumber = o.PONumber,
                    CurrencyCode = o.CurrencyCode,
                    OrderDate = o.OrderDate,
                    Status = o.Status,
                    ExchangeRate = o.ExchangeRate,
                    TotalDiscount = o.TotalDiscount,
                    TotalTax = o.TotalTax,
                    TotalAmount = o.TotalAmount,
                    Items = o.Items.Select(x => new PurchaseOrderItemResponseDto
                    {
                        ID = x.ID,
                        ProductId = x.ProductId,
                        ProductName = x.Product?.Name,
                        Quantity = x.Quantity,
                        UnitPrice = x.UnitPrice,
                        Discount = x.Discount,
                        TaxPercentage = x.TaxPercentage,
                        TaxAmount = x.TaxAmount,
                        ReceivedQuantity = x.ReceivedQuantity,
                        LineTotal = x.LineTotal,
                    }).ToList()
                }).ToList();

                var pagedData = new PagedResponse<PurchaseOrderResponseDto>
                {
                    TotalCount = totalCount,
                    Page = pageNumber,
                    PageSize = pageSize,
                    Items = mappedItems
                };

                return ResponseDataModel<PagedResponse<PurchaseOrderResponseDto>>.SuccessResponse(pagedData);
            }
            catch (Exception ex)
            {
                return ResponseDataModel<PagedResponse<PurchaseOrderResponseDto>>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<PurchaseOrderResponseDto>> GetPurchaseOrderByIdAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var order = await _repository.GetByIdAsync(id, cancellationToken);
                if (order == null) return ResponseDataModel<PurchaseOrderResponseDto>.FailureResponse("Not Found");

                var responseDto = new PurchaseOrderResponseDto
                {
                    ID = order.ID,
                    VendorId = order.VendorId,
                    VendorName = order.Vendor?.Name ?? "Vendor-" + order.VendorId,
                    PONumber = order.PONumber,
                    CurrencyCode = order.CurrencyCode,
                    ExchangeRate = order.ExchangeRate,
                    OrderDate = order.OrderDate,
                    Status = order.Status,
                    TotalDiscount = order.TotalDiscount,
                    TotalTax = order.TotalTax,
                    TotalAmount = order.TotalAmount,
                    Items = order.Items.Select(i => new PurchaseOrderItemResponseDto
                    {
                        ID = i.ID,
                        ProductId = i.ProductId,
                        ProductName = i.Product?.Name ?? "Product-" + i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Discount = i.Discount,
                        TaxPercentage = i.TaxPercentage,
                        TaxAmount = i.TaxAmount,
                        LineTotal = i.LineTotal,
                        ReceivedQuantity = i.ReceivedQuantity
                    }).ToList()
                };

                return ResponseDataModel<PurchaseOrderResponseDto>.SuccessResponse(responseDto);
            }
            catch (Exception ex)
            {
                return ResponseDataModel<PurchaseOrderResponseDto>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<PurchaseOrderResponseDto>> UpdatePurchaseOrderAsync(PurchaseOrderRequestDto request, CancellationToken cancellationToken)
        {
            try
            {
                var tenantId = _currentUserService.TenantId;
                var branchId = _currentUserService.BranchId;

                var orderToUpdate = new PurchaseOrder
                {
                    ID = request.ID,
                    VendorId = request.VendorId,
                    PONumber = request.PONumber,
                    CurrencyCode = request.CurrencyCode,
                    ExchangeRate = request.ExchangeRate,
                    OrderDate = request.OrderDate,
                    Status = request.Status,
                    TotalDiscount = request.TotalDiscount,
                    TotalTax = request.TotalTax,
                    TotalAmount = request.TotalAmount,
                    BranchId = branchId,
                    TenantId = tenantId,
                    Items = request.Items.Select(i => new PurchaseOrderItem
                    {
                        ID = i.ID ?? 0,
                        POId = request.ID,
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Discount = i.Discount,
                        TaxPercentage = i.TaxPercentage,
                        TaxAmount = i.TaxAmount,
                        LineTotal = i.LineTotal,
                        ReceivedQuantity = i.ReceivedQuantity ?? 0,
                        TenantId = tenantId,
                        BranchId = branchId
                    }).ToList()
                };

                await _repository.UpdateAsync(orderToUpdate, cancellationToken);

                return await GetPurchaseOrderByIdAsync(request.ID, cancellationToken);
            }
            catch (Exception ex)
            {
                return ResponseDataModel<PurchaseOrderResponseDto>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<bool>> DeletePurchaseOrderAsync(int id, CancellationToken cancellationToken)
        {
            var exists = await _repository.GetByIdAsync(id, cancellationToken);

            if (exists == null)
                return ResponseDataModel<bool>.FailureResponse("PurchaseOrderItem not found");

            var deleted = await _repository.DeleteAsync(id, cancellationToken);
            if (deleted)
            {
                if (exists.VendorQuotationId > 0)
                {
                    var quotation = await _vendorQuotationInterface.GetByIdAsync(exists.VendorQuotationId, cancellationToken);

                    if (quotation != null)
                    {
                        quotation.Status = "Pending";
                        await _vendorQuotationInterface.UpdateAsync(quotation, cancellationToken);
                    }
                }

                return ResponseDataModel<bool>.SuccessResponse(true, "Sale deleted and Quotation reverted to Pending.");
            }

            return ResponseDataModel<bool>.SuccessResponse(deleted, "PurchaseOrderItem deleted successfully");
        }

        public async Task<ResponseDataModel<PurchaseOrderResponseDto>> ConvertQuotationToPurchaseAsync(int vendorQuotationId, CancellationToken cancellationToken)
        {
            try
            {
                var quotation = await _quotationRepository.GetByIdAsync(vendorQuotationId, cancellationToken);
                if (quotation == null)
                    return ResponseDataModel<PurchaseOrderResponseDto>.FailureResponse("Vendor Quotation not found");
                if (quotation.Status == "Converted" || quotation.Status == "Ordered")
                    return ResponseDataModel<PurchaseOrderResponseDto>.FailureResponse("This quotation is already converted to a Purchase Order.");
                var purchaseOrder = new PurchaseOrder
                {
                    VendorId = quotation.VendorId,
                    OrderDate = DateTime.Now,
                    Status = "Ordered",
                    PONumber = quotation.VQNumber,
                    CurrencyCode = quotation.CurrencyCode,
                    ExchangeRate = quotation.ExchangeRate,
                    TotalDiscount = quotation.TotalDiscount,
                    VendorQuotationId=quotation.ID,
                    TotalTax = quotation.TotalTax,
                    TotalAmount = quotation.NetAmount,
                    BranchId = _currentUserService.BranchId,
                    TenantId = _currentUserService.TenantId,

                    Items = quotation.Items.Select(qItem => new PurchaseOrderItem
                    {
                        ProductId = qItem.ProductId,
                        Quantity = qItem.Quantity,
                        UnitPrice = qItem.UnitPrice,
                        Discount = qItem.DiscountAmount,
                        TaxPercentage = qItem.TaxPercentage,
                        TaxAmount = qItem.TaxAmount,
                        LineTotal = qItem.LineTotal,
                        ReceivedQuantity = 0,
                        TenantId = _currentUserService.TenantId,
                        BranchId = _currentUserService.BranchId,
                    }).ToList()
                };

                var result = await _repository.CreateAsync(purchaseOrder, cancellationToken);
                quotation.Status = "Converted";
                await _quotationRepository.UpdateAsync(quotation, cancellationToken);

                var responseDto = new PurchaseOrderResponseDto { ID = result.ID, PONumber = result.PONumber };
                return ResponseDataModel<PurchaseOrderResponseDto>.SuccessResponse(responseDto, "Quotation converted to Purchase Order successfully!");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<PurchaseOrderResponseDto>.FailureResponse(ex.Message);
            }
        }
    }
}