using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.GoodReceived;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PurchaseDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.EntityFrameworkCore.Storage;
using Org.BouncyCastle.Asn1.Ocsp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class GoodReceivedService : IGoodReceivedService
    {
        private readonly IGoodReceivedInterface _grnRepo;
        private readonly IPurchaseOrderItemInterface _poItemRepo;
        private readonly IStockTransactionInterface _stockTransactionRepo;
        private readonly ICurrentUserService _currentUser;

        public GoodReceivedService(IGoodReceivedInterface grnRepo,IPurchaseOrderItemInterface poItemRepo,
            IStockTransactionInterface stockTransactionRepo,ICurrentUserService currentUser)
        {
            _grnRepo = grnRepo;
            _poItemRepo = poItemRepo;
            _stockTransactionRepo = stockTransactionRepo;
            _currentUser = currentUser;
        }

        public async Task<ResponseDataModel<string>> CreateGoodReceived(GoodReceivedRequestDto request, CancellationToken ct)
        {
            using var transaction = await _grnRepo.BeginTransactionAsync(ct) as IDbContextTransaction;

            if (transaction == null)
                return ResponseDataModel<string>.FailureResponse("Database transaction could not be started.");

            try
            {
                if (request.Items == null || !request.Items.Any())
                    return ResponseDataModel<string>.FailureResponse("No items provided.");

                var grn = new GoodsReceived
                {
                    POId = request.POId,
                    Date = request.Date,
                    Remarks = request.Remarks,
                    VendorChallanNumber = request.VendorChallanNumber,
                    WarehouseId = request.WarehouseId,
                    Status = request.Status ?? "Pending",
                    GRNNumber = request.GRNNumber,
                    TenantId = _currentUser.TenantId,
                    BranchId = _currentUser.BranchId,
                    Items = new List<GoodsReceivedItem>()
                };

                await _grnRepo.AddAsync(grn, ct);
                await _grnRepo.SaveChangesAsync(ct);

                foreach (var item in request.Items)
                {
                    var poItem = await _poItemRepo.GetByIdAsync(item.PoItemId, ct);
                    if (poItem == null) continue;

                    if ((poItem.ReceivedQuantity + item.QuantityReceived) > poItem.Quantity)
                    {
                        await transaction.RollbackAsync(ct);
                        return ResponseDataModel<string>.FailureResponse($"Product {item.ProductId}: Over-receiving not allowed!");
                    }

                    grn.Items.Add(new GoodsReceivedItem
                    {
                        GoodsReceivedId = grn.ID,
                        ProductId = item.ProductId,
                        PoItemId = item.PoItemId,
                        QuantityReceived = item.QuantityReceived,
                        BatchNumber = item.BatchNumber,
                        ExpiryDate = item.ExpiryDate,
                        TenantId = _currentUser.TenantId,
                        BranchId = _currentUser.BranchId
                    });

                    poItem.ReceivedQuantity += item.QuantityReceived;
                    _poItemRepo.Update(poItem);

                    var stockLog = new StockTransaction
                    {
                        ProductId = item.ProductId,
                        TransactionType = "GRN",
                        Quantity = item.QuantityReceived,
                        TransactionDate = DateTime.Now,
                        UnitPrice = poItem.UnitPrice,
                        WarehouseId = request.WarehouseId,
                        ReferenceId = grn.ID,
                        Remarks = $"Received against PO #{request.POId} | Batch: {item.BatchNumber}",
                        TenantId = _currentUser.TenantId,
                        BranchId = _currentUser.BranchId
                    };
                    await _stockTransactionRepo.CreateStockTransaction(stockLog, ct);
                }

                await _grnRepo.SaveChangesAsync(ct);
                await transaction.CommitAsync(ct);

                return ResponseDataModel<string>.SuccessResponse("Success", "Goods Received and Stock updated successfully!");
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync(ct);
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return ResponseDataModel<string>.FailureResponse($"Database Error: {innerMessage}");
            }
        }

        public async Task<List<GoodReceivedViewDto>> GetAllGoodReceiveds(CancellationToken ct)
        {
            var list = await _grnRepo.GetAll(ct);
            return list.Select(x => new GoodReceivedViewDto
            {
                ID = x.ID,
                GRNNumber = x.GRNNumber,
                POId = x.POId,
                Date = x.Date,
                Remarks = x.Remarks,
                VendorChallanNumber = x.VendorChallanNumber,
                WarehouseId = x.WarehouseId,
                Items = x.Items.Select(i => new GoodReceivedViewItemDto
                {
                    //ID = i.ID,
                    GoodsReceivedId = i.GoodsReceivedId,
                    ProductId = i.ProductId,
                    QuantityReceived = i.QuantityReceived,
                    BatchNumber = i.BatchNumber,
                    ExpiryDate = i.ExpiryDate,
                }).ToList()
            }).ToList();
        }

        public async Task<int> SaveChangesAsync(CancellationToken ct)
        {
            // Ab ye error nahi dega kyunke interface return type 'Task<int>' hai
            return await _grnRepo.SaveChangesAsync(ct);
        }

        public Task<bool> DeleteGoodReceived(int id, CancellationToken ct)
        {
            return _grnRepo.DeleteGoodsReceived(id, ct);
        }

        public async Task<ResponseDataModel<PagedResponse<GoodReceivedViewDto>>> GetAllGoodReceiveds(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            try
            {
                var allOrders = await _grnRepo.GetAll(cancellationToken);
                var totalCount = allOrders.Count();
                var paginatedOrders = allOrders
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                var mappedItems = paginatedOrders.Select(request => new GoodReceivedViewDto
                {
                    ID = request.ID,
                    POId = request.POId,
                    Date = request.Date,
                    Remarks = request.Remarks,
                    VendorChallanNumber = request.VendorChallanNumber,
                    WarehouseId = request.WarehouseId,
                    Status = request.Status,
                    GRNNumber = request.GRNNumber,
                
                    Items = request.Items.Select(item => new GoodReceivedViewItemDto
                    {
                        //ID = item.ID,
                        ProductId = item.ProductId,
                        GoodsReceivedId = item.GoodsReceivedId,
                        QuantityReceived = item.QuantityReceived,
                        BatchNumber = item.BatchNumber,
                        ExpiryDate = item.ExpiryDate,
                      
                    }).ToList()
                }).ToList();

                var pagedData = new PagedResponse<GoodReceivedViewDto>
                {
                    TotalCount = totalCount,
                    Page = pageNumber,
                    PageSize = pageSize,
                    Items = mappedItems
                };

                return ResponseDataModel<PagedResponse<GoodReceivedViewDto>>.SuccessResponse(pagedData);
            }
            catch (Exception ex)
            {
                return ResponseDataModel<PagedResponse<GoodReceivedViewDto>>.FailureResponse(ex.Message);
            }
        }
        public async Task<GoodReceivedViewDto> GetGoodReceivedById(int id, CancellationToken ct)
        {
            var x = await _grnRepo.GetByIdAsync(id, ct);
            if (x == null) return null;

            return new GoodReceivedViewDto
            {
                ID = x.ID,
                GRNNumber = x.GRNNumber,
                // ... baki properties ki mapping yahan add karlein
            };
        }
    }
}