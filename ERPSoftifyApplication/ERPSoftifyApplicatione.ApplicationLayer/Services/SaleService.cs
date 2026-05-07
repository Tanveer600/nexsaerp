using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.SalesOutput;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class Saleervice:ISaleService
    {
        private readonly ISaleInterface _repository;
        private readonly ICurrentUserService _currentUserService;
        private readonly ICustomerService _customerService;
        private readonly IQuotationInterface _quotationRepository;
        public Saleervice(ISaleInterface repository, ICurrentUserService currentUserService, ICustomerService customerService, IQuotationInterface quotationRepository)
        {
            _repository = repository;
            _currentUserService = currentUserService;
            _customerService = customerService;
            _quotationRepository = quotationRepository;
        }
        public async Task<ResponseDataModel<SaleViewDto>> ConvertQuotationToSaleAsync(int quotationId, CancellationToken cancellationToken)
        {
            try
            {
                var quotation = await _quotationRepository.GetByIdAsync(quotationId, cancellationToken);
                if (quotation == null)
                    return ResponseDataModel<SaleViewDto>.FailureResponse("Quotation not found");

                if (quotation.Status == "Ordered")
                    return ResponseDataModel<SaleViewDto>.FailureResponse("This quotation is already converted to a sale.");

                var saleOrder = new SalesOrder
                {
                    QuotationId = quotation.ID,
                    OrderDate = DateTime.Now,
                    Status = "Ordered",
                    BranchId = _currentUserService.BranchId,
                    TenantId = _currentUserService.TenantId,
                    Items = quotation.QuotationItems.Select(qItem => new SalesOrderItem
                    {
                        ProductId = qItem.ProductId,
                        Quantity = qItem.Quantity,
                        UnitPrice = qItem.UnitPrice,
                        Discount = qItem.DiscountAmount,
                        TaxAmount = qItem.TaxAmount,
                        TenantId = _currentUserService.TenantId,
                        BranchId = _currentUserService.BranchId,
                        QuotationId = quotation.ID 
                    }).ToList()
                };
                var result = await _repository.CreateAsync(saleOrder, cancellationToken);
                quotation.Status = "Ordered";
                await _quotationRepository.UpdateAsync(quotation, cancellationToken);
                var responseDto = new SaleViewDto { ID = result.ID };
                return ResponseDataModel<SaleViewDto>.SuccessResponse(responseDto, "Quotation Approved and Sale Created!");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<SaleViewDto>.FailureResponse(ex.Message);
            }
        }
        public Task<ResponseDataModel<SaleViewDto>> CreateQuotationAsync(CreateSaleRequest request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public async Task<ResponseDataModel<SaleViewDto>> CreateSaleAsync(CreateSaleRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var orderEntity = new SalesOrder
                {
                    QuotationId = request.QuotationId,
                    Status = request.Status,
                    OrderDate = request.OrderDate,
                    BranchId = _currentUserService.BranchId,
                    TenantId = _currentUserService.TenantId,
                    
                    Items = request.Items.Select(i => new SalesOrderItem
                    {
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Discount = i.Discount,
                        TaxAmount = i.TaxAmount,
                        TenantId = _currentUserService.TenantId,
                        BranchId = _currentUserService.BranchId,
                    }).ToList()
                };

                var result = await _repository.CreateAsync(orderEntity, cancellationToken);

                var responseDto = new SaleViewDto
                {
                    ID = result.ID,
                    QuotationId = result.QuotationId,
                    OrderDate = result.OrderDate,
                   // CustomerName = result.Customer?.Name,
                    Status = result.Status,
                    Items = result.Items.Select(item => new SaleItemViewDto
                    {
                        SOId = item.ID,
                        ProductId = item.ProductId,
                        //ProductName = item.Product?.Name,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        Discount = item.Discount,
                        TaxAmount = item.TaxAmount
                    }).ToList()
                };

                return ResponseDataModel<SaleViewDto>.SuccessResponse(responseDto, "Created Successfully");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<SaleViewDto>.FailureResponse(ex.Message);
            }
        }

        public Task<ResponseDataModel<bool>> DeleteQuotationAsync(int id, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public async Task<ResponseDataModel<bool>> DeleteSaleAsync(int id, CancellationToken cancellationToken)
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

        public Task<ResponseDataModel<PagedResponse<SaleViewDto>>> GetAllQuotationsAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public async Task<ResponseDataModel<PagedResponse<SaleViewDto>>> GetAllSalesAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            try
            {
                var allOrders = await _repository.GetAllAsync(cancellationToken);
                var totalCount = allOrders.Count();

                var paginatedOrders = allOrders
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                var mappedItems = paginatedOrders.Select(o => new SaleViewDto
                {

                    ID = o.ID,
                    QuotationId = o.QuotationId,
                    Status = o.Status,
                    OrderDate = o.OrderDate,
                    Items = o.Items.Select(i => new SaleItemViewDto
                    {
                        SOId = i.ID,
                        ProductId = i.ProductId,
                       // ProductName = i.Product?.Name,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        TaxAmount = i.TaxAmount,
                    }).ToList()
                }).ToList();

                var pagedData = new PagedResponse<SaleViewDto>
                {
                    TotalCount = totalCount,
                    Page = pageNumber,
                    PageSize = pageSize,
                    Items = mappedItems
                };

                return ResponseDataModel<PagedResponse<SaleViewDto>>.SuccessResponse(pagedData);
            }
            catch (Exception ex)
            {
                return ResponseDataModel<PagedResponse<SaleViewDto>>.FailureResponse(ex.Message);
            }
        }

        public Task<ResponseDataModel<SaleViewDto>> GetQuotationByIdAsync(int id, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public async Task<ResponseDataModel<SaleViewDto>> GetSaleByIdAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var order = await _repository.GetByIdAsync(id, cancellationToken);
                if (order == null) return ResponseDataModel<SaleViewDto>.FailureResponse("Not Found");

                var responseDto = new SaleViewDto
                {
                    ID = order.ID,
                    QuotationId = order.QuotationId,
                    Status = order.Status,
                    OrderDate = order.OrderDate,
                    TenantId = order.TenantId,
                    BranchId = order.BranchId,
                  
                    Items = order.Items.Select(i => new SaleItemViewDto
                    {
                        SOId = i.ID,
                        ProductId = i.ProductId,
                        //ProductName = i.Product?.Name,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Discount = i.Discount,
                        TaxAmount = i.TaxAmount
                    }).ToList()
                };

                return ResponseDataModel<SaleViewDto>.SuccessResponse(responseDto);
            }
            catch (Exception ex)
            {
                return ResponseDataModel<SaleViewDto>.FailureResponse(ex.Message);
            }
        }

        public Task<ResponseDataModel<SaleViewDto>> UpdateQuotationAsync(UpdateSaleRequest request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public async Task<ResponseDataModel<SaleViewDto>> UpdateSaleAsync(UpdateSaleRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var orderToUpdate = new SalesOrder
                {
                    
                    QuotationId = request.QuotationId,
                    Status = request.Status,
                    OrderDate = request.OrderDate,
                    BranchId = _currentUserService.BranchId,
                    TenantId = _currentUserService.TenantId,


                    Items = request.Items.Select(i => new SalesOrderItem
                    {
                       
                        SOId = request.ID,
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        TaxAmount = i.TaxAmount,
                        BranchId = _currentUserService.BranchId,
                        TenantId = _currentUserService.TenantId,
                    }).ToList()
                };

                var result = await _repository.UpdateAsync(orderToUpdate, cancellationToken);

                var responseDto = new SaleViewDto
                {
                    ID = result.ID,
                    QuotationId = result.QuotationId,
                    Status = result.Status,
                    OrderDate = result.OrderDate,
                    TenantId= result.TenantId,
                    BranchId= result.BranchId,
                    Items = result.Items.Select(item => new SaleItemViewDto
                    {
                       
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        Discount = item.Discount,
                        SOId = item.SOId,
                        TaxAmount = item.TaxAmount
                    }).ToList()
                };


                return ResponseDataModel<SaleViewDto>.SuccessResponse(responseDto, "Updated Successfully");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<SaleViewDto>.FailureResponse(ex.Message);
            }
        }
    }
}
