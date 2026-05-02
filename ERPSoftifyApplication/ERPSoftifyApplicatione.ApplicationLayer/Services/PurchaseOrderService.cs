using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PurchaseDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class PurchaseOrderService: IPurchaseOrderService
    {
        private readonly IPurchaseOrderInterface _repository;
        private readonly ICurrentUserService _currentUserService;
        public PurchaseOrderService(IPurchaseOrderInterface repository, ICurrentUserService currentUserService)
        {
            _repository = repository;
            _currentUserService = currentUserService;
        }

        public async Task<ResponseDataModel<PurchaseOrderResponseDto>> CreatePurchaseOrderAsync(PurchaseOrderRequestDto request, CancellationToken cancellationToken)
        {
            try
            {
                var tenantId = _currentUserService.TenantId;
                var branchId = _currentUserService.BranchId;
                var orderEntity = new PurchaseOrder
                {
                    VendorId = request.VendorId,
                    OrderDate = request.OrderDate,
                    Status = request.Status,
                    BranchId = _currentUserService.BranchId,
                    TenantId=_currentUserService.TenantId,
                    Items = request.Items.Select(i => new PurchaseOrderItem
                    {
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Discount = i.Discount,
                        TaxAmount = i.TaxAmount,
                        TenantId = tenantId,
                        BranchId = branchId,
                        
                    }).ToList()
                };

                var result = await _repository.CreateAsync(orderEntity, cancellationToken);

                var responseDto = new PurchaseOrderResponseDto
                {
                    ID = result.ID,
                    VendorId = result.VendorId,
                    VendorName = "Vendor-" + result.VendorId, 
                    OrderDate = result.OrderDate,
                    Status = result.Status,
                    Items = result.Items.Select(item => new PurchaseOrderItemResponseDto
                    {
                        ID = item.ID,
                        ProductId = item.ProductId,
                        ProductName = "Product-" + item.ProductId, 
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        Discount = item.Discount,
                        TaxAmount = item.TaxAmount
                    }).ToList()
                };

                return ResponseDataModel<PurchaseOrderResponseDto>.SuccessResponse(responseDto, "Created Successfully");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<PurchaseOrderResponseDto>.FailureResponse(ex.Message);
            }
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
                    VendorName = "Vendor-" + o.VendorId,
                    OrderDate = o.OrderDate,
                    Status = o.Status,
                    Items = o.Items.Select(i => new PurchaseOrderItemResponseDto
                    {
                        ID = i.ID,
                        ProductId = i.ProductId,
                        ProductName = "Product-" + i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Discount = i.Discount,
                        TaxAmount = i.TaxAmount
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
                    VendorName = "Vendor-" + order.VendorId,
                    OrderDate = order.OrderDate,
                    Status = order.Status,
                    Items = order.Items.Select(i => new PurchaseOrderItemResponseDto
                    {
                        ID = i.ID,
                        ProductId = i.ProductId,
                        ProductName = "Product-" + i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Discount = i.Discount,
                        TaxAmount = i.TaxAmount
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
                var orderToUpdate = new PurchaseOrder
                {
                    ID = request.ID,
                    VendorId = request.VendorId,
                    OrderDate = request.OrderDate,
                    Status = request.Status,
                    Items = request.Items.Select(i => new PurchaseOrderItem
                    {
                        ID = i.ID ?? 0,
                        POId = request.ID,
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Discount = i.Discount,
                        TaxAmount = i.TaxAmount
                    }).ToList()
                };

                var result = await _repository.UpdateAsync(orderToUpdate, cancellationToken);

                var responseDto = new PurchaseOrderResponseDto
                {
                    ID = result.ID,
                    VendorId = result.VendorId,
                    VendorName = "Vendor-" + result.VendorId,
                    OrderDate = result.OrderDate,
                    Status = result.Status,
                    Items = result.Items.Select(item => new PurchaseOrderItemResponseDto
                    {
                        ID = item.ID,
                        ProductId = item.ProductId,
                        ProductName = "Product-" + item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        Discount = item.Discount,
                        TaxAmount = item.TaxAmount
                    }).ToList()
                };

                return ResponseDataModel<PurchaseOrderResponseDto>.SuccessResponse(responseDto, "Updated Successfully");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<PurchaseOrderResponseDto>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<bool>> DeletePurchaseOrderAsync(int id, CancellationToken cancellationToken)
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
    }
}
