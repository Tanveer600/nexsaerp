using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PurchaseDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.QuotationOutput;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class QuotationService : IQuotationService
    {

        private readonly IQuotationInterface _repository;
        private readonly ICurrentUserService _currentUserService;
        public QuotationService(IQuotationInterface repository, ICurrentUserService currentUserService)
        {
            _repository = repository;
            _currentUserService = currentUserService;
        }

        public  async Task<ResponseDataModel<QuotationResponseDto>> CreateQuotationAsync(QuotationRequestDto request, CancellationToken cancellationToken)
        {
            try
            {
                var tenantId = _currentUserService.TenantId;
                var branchId = _currentUserService.BranchId;
                var orderEntity = new Quotation
                {
                   CustomerId=request.CustomerId,
                     Status = request.Status,
                    BranchId = _currentUserService.BranchId,
                    TenantId = _currentUserService.TenantId,
                    QuotationItems = request.QuotationItems.Select(i => new QuotationItem
                    {
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,                       
                        TenantId = tenantId,
                        BranchId = branchId,

                    }).ToList()
                };

                var result = await _repository.CreateAsync(orderEntity, cancellationToken);

                var responseDto = new QuotationResponseDto
                {
                    ID = result.ID,
                   CustomerId = result.CustomerId,                                    
                    Status = result.Status,
                    QuotationItems = result.QuotationItems.Select(item => new QuotationItemResponseDto
                    {
                        ID = item.ID,
                        ProductId = item.ProductId,
                        ProductName = "Product-" + item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,                      
                    }).ToList()
                };

                return ResponseDataModel<QuotationResponseDto>.SuccessResponse(responseDto, "Created Successfully");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<QuotationResponseDto>.FailureResponse(ex.Message);
            }
        }

        public  async Task<ResponseDataModel<bool>> DeleteQuotationAsync(int id, CancellationToken cancellationToken)
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
      

        public async Task<ResponseDataModel<PagedResponse<QuotationResponseDto>>> GetAllQuotationsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            try
            {
                var allOrders = await _repository.GetAllAsync(cancellationToken);

                var totalCount = allOrders.Count();
                var paginatedOrders = allOrders
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                var mappedItems = paginatedOrders.Select(o => new QuotationResponseDto
                {
                    ID = o.ID,                   
                    Status = o.Status,
                    QuotationItems = o.QuotationItems.Select(i => new QuotationItemResponseDto
                    {
                        ID = i.ID,
                        ProductId = i.ProductId,
                        ProductName = "Product-" + i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,                        
                    }).ToList()
                }).ToList();

                var pagedData = new PagedResponse<QuotationResponseDto>
                {
                    TotalCount = totalCount,
                    Page = pageNumber,
                    PageSize = pageSize,
                    Items = mappedItems
                };

                return ResponseDataModel<PagedResponse<QuotationResponseDto>>.SuccessResponse(pagedData);
            }
            catch (Exception ex)
            {
                return ResponseDataModel<PagedResponse<QuotationResponseDto>>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<QuotationResponseDto>> GetQuotationByIdAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var order = await _repository.GetByIdAsync(id, cancellationToken);
                if (order == null) return ResponseDataModel<QuotationResponseDto>.FailureResponse("Not Found");
                var responseDto = new QuotationResponseDto
                {
                    ID = order.ID,                 
                    Status = order.Status,
                    QuotationItems = order.QuotationItems.Select(i => new QuotationItemResponseDto
                    {
                        ID = i.ID,
                        ProductId = i.ProductId,
                        ProductName = "Product-" + i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                      
                    }).ToList()
                };

                return ResponseDataModel<QuotationResponseDto>.SuccessResponse(responseDto);
            }
            catch (Exception ex)
            {
                return ResponseDataModel<QuotationResponseDto>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<QuotationResponseDto>> UpdateQuotationAsync(QuotationRequestDto request, CancellationToken cancellationToken)
        {
            try
            {
                var orderToUpdate = new Quotation
                {
                    ID = request.ID,                   
                    Status = request.Status,
                    QuotationItems = request.QuotationItems.Select(i => new QuotationItem
                    {
                        ID = i.ID ?? 0,                       
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                      
                    }).ToList()
                };

                var result = await _repository.UpdateAsync(orderToUpdate, cancellationToken);

                var responseDto = new QuotationResponseDto
                {
                    ID = result.ID,                
                     Status = result.Status,
                    QuotationItems = result.QuotationItems.Select(item => new QuotationItemResponseDto
                    {
                        ID = item.ID,
                        ProductId = item.ProductId,
                        ProductName = "Product-" + item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                       
                    }).ToList()
                };

                return ResponseDataModel<QuotationResponseDto>.SuccessResponse(responseDto, "Updated Successfully");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<QuotationResponseDto>.FailureResponse(ex.Message);
            }
        }
    }
}
