using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.SalesOutput;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class Saleervice : ISaleService
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
        public async Task<string> GenerateNextSaleNumberAsync(CancellationToken cancellationToken)
        {
            var allQuotations = await _repository.GetAllAsync(cancellationToken);
            string prefix = $"SO-{DateTime.Now.Year}-";
            int nextNumber = 1;

            var lastQuotation = allQuotations
                .Where(q => q.SONumber != null && q.SONumber.StartsWith(prefix))
                .OrderByDescending(q => q.SONumber)
                .FirstOrDefault();

            if (lastQuotation != null)
            {
                string lastPart = lastQuotation.SONumber.Replace(prefix, "");
                if (int.TryParse(lastPart, out int lastVal))
                {
                    nextNumber = lastVal + 1;
                }
            }

            return $"{prefix}{nextNumber:D4}";
        }
        public async Task<ResponseDataModel<List<SaleViewDto>>> GetAllSaleListAsync(CancellationToken cancellationToken)
        {
            var query = await _repository.GetAllAsync(cancellationToken);

            var Products = query.Select(b => new SaleViewDto
            {
                ID = b.ID,
                SONumber = b.SONumber,
                CustomerId = b.CustomerId, 
                OrderDate = b.OrderDate,
                CustomerName=b.Customer.Name,
                Items = b.Items.Select(i => new SaleItemViewDto
                {
                    ID = i.ID, 
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    ProductName = i.Product.Name,
                    DeliveredQuantity=i.DeliveredQuantity,

                }).ToList()
            }).ToList();

            return ResponseDataModel<List<SaleViewDto>>.SuccessResponse(Products);
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
                    CustomerId= quotation.CustomerId,
                    OrderDate = DateTime.Now,
                    Status = "Ordered",
                    SONumber=quotation.QuotationNumber,
                    TotalTax= quotation.TotalTax,
                    TotalDiscount= quotation.TotalDiscount,
                    TotalAmount=quotation.NetAmount,
                    BranchId = _currentUserService.BranchId,
                    TenantId = _currentUserService.TenantId,
                    Items = quotation.QuotationItems.Select(qItem => new SalesOrderItem
                    {
                        ProductId = qItem.ProductId,
                        SOId=qItem.QuotationId,
                        Quantity = qItem.Quantity,
                        UnitPrice = qItem.UnitPrice,
                        TaxPercentage=qItem.TaxPercentage,
                        LineTotal= qItem.LineTotal, 
                        DeliveredQuantity=0,
                        Discount = qItem.DiscountAmount,
                        TaxAmount = qItem.TaxAmount,
                        //DeliveredQuantity = 0,
                        TenantId = _currentUserService.TenantId,
                        BranchId = _currentUserService.BranchId,
                        
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


        public async Task<ResponseDataModel<SaleViewDto>> CreateSaleAsync(CreateSaleRequest request, CancellationToken cancellationToken)
        {

            try
            {
                string nextSaleNumber = await GenerateNextSaleNumberAsync(cancellationToken);
                var orderEntity = new SalesOrder
                {
                    QuotationId = request.QuotationId,
                    SONumber = nextSaleNumber,
                    CustomerId = request.CustomerId,
                    TotalAmount = request.TotalAmount,
                    TotalDiscount = request.TotalDiscount,
                    TotalTax = request.TotalTax,
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
                    SONumber = result.SONumber,
                    //CustomerName = result.Customer?.Name,
                    CustomerId = result.CustomerId,
                    TotalAmount = result.TotalAmount,
                    TotalDiscount = result.TotalDiscount,
                    TotalTax = result.TotalTax,
                    Status = result.Status,
                    Items = result.Items.Select(item => new SaleItemViewDto
                    {
                        SOId = item.ID,
                        ProductId = item.ProductId,
                        ProductName = item.Product?.Name,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        TaxPercentage = item.TaxPercentage,
                        LineTotal = item.LineTotal,
                        DeliveredQuantity = item.DeliveredQuantity,
                        Discount = item.Discount,
                        TaxAmount = item.TaxAmount,

                    }).ToList()
                };
 
                return ResponseDataModel<SaleViewDto>.SuccessResponse(responseDto, "Created Successfully");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<SaleViewDto>.FailureResponse(ex.Message);
            }
        }

        public async Task<ResponseDataModel<bool>> DeleteSaleAsync(int id, CancellationToken cancellationToken)
        {
            try
            {

                var saleOrder = await _repository.GetByIdAsync(id, cancellationToken);

                if (saleOrder == null)
                    return ResponseDataModel<bool>.FailureResponse("Sale Order not found");
                var deleted = await _repository.DeleteAsync(id, cancellationToken);

                if (deleted)
                {
                    if (saleOrder.QuotationId > 0)
                    {
                        var quotation = await _quotationRepository.GetByIdAsync(saleOrder.QuotationId, cancellationToken);

                        if (quotation != null)
                        {
                            quotation.Status = "Pending";
                            await _quotationRepository.UpdateAsync(quotation, cancellationToken);
                        }
                    }

                    return ResponseDataModel<bool>.SuccessResponse(true, "Sale deleted and Quotation reverted to Pending.");
                }

                return ResponseDataModel<bool>.FailureResponse("Failed to delete Sale Order");
            }
            catch (Exception ex)
            {
                return ResponseDataModel<bool>.FailureResponse(ex.Message);
            }
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
                    SONumber=o.SONumber,
                    CustomerId = o.CustomerId,
                    CustomerName=o.Customer.Name,
                    TotalAmount = o.TotalAmount,
                    TotalDiscount = o.TotalDiscount,
                    TotalTax = o.TotalTax,
                    OrderDate = o.OrderDate,
                    Items = o.Items.Select(i => new SaleItemViewDto
                    {
                        SOId = i.ID,
                        ProductId = i.ProductId,
                         ProductName = i.Product.Name,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        TaxAmount = i.TaxAmount,
                        TaxPercentage = i.TaxPercentage,
                        LineTotal = i.LineTotal,
                        DeliveredQuantity = i.DeliveredQuantity,
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
                    SONumber=order.SONumber,
                    TotalDiscount = order.TotalDiscount,    
                    TotalTax = order.TotalTax,  
                    TotalAmount = order.TotalAmount,
                    OrderDate = order.OrderDate,
                    TenantId = order.TenantId,
                    BranchId = order.BranchId,

                    Items = order.Items.Select(i => new SaleItemViewDto
                    {
                        SOId = i.ID,
                        ProductId = i.ProductId,
                        ProductName = i.Product?.Name,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Discount = i.Discount,
                        TaxAmount = i.TaxAmount,
                        TaxPercentage = i.TaxPercentage,
                        LineTotal = i.LineTotal,
                        DeliveredQuantity = i.DeliveredQuantity,

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
                    SONumber = request.SONumber,
                    TotalDiscount = request.TotalDiscount,
                    TotalTax = request.TotalTax,
                    TotalAmount = request.TotalAmount,
                    OrderDate =     request.OrderDate,
                    TenantId = request.TenantId,
                    BranchId = request.BranchId,
                    CustomerId= request.CustomerId,
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
                    TenantId = result.TenantId,
                    BranchId = result.BranchId,
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
