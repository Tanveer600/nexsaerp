using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.GoodReceived;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.EntityFrameworkCore.Storage;
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
        private readonly IPurchaseOrderItemItemInterface _poItemRepo;
        private readonly IStockTransactionInterface _stockTransactionRepo;
        private readonly ICurrentUserService _currentUser;

        public GoodReceivedService(IGoodReceivedInterface grnRepo,IPurchaseOrderItemItemInterface poItemRepo,
            IStockTransactionInterface stockTransactionRepo,ICurrentUserService currentUser)
        {
            _grnRepo = grnRepo;
            _poItemRepo = poItemRepo;
            _stockTransactionRepo = stockTransactionRepo;
            _currentUser = currentUser;
        }

        public async Task<ResponseDataModel<string>> CreateGoodReceived(GoodReceivedRequestDto request, CancellationToken ct)
        {
            // 1. Transaction start karein
            using var transaction = await _grnRepo.BeginTransactionAsync(ct) as IDbContextTransaction;

            try
            {
                if (request.Items == null || !request.Items.Any())
                {
                    return ResponseDataModel<string>.FailureResponse("No items provided in the request.");
                }

                var grn = new GoodsReceived
                {
                    POId = request.POId,
                    Date = request.Date,
                    Remarks = request.Remarks,
                    VendorChallanNumber = request.VendorChallanNumber,
                    WarehouseId = request.WarehouseId,
                    Status = request.Status,
                    GRNNumber = request.GRNNumber,
                    TenantId = _currentUser.TenantId,
                    BranchId = _currentUser.BranchId,
                    Items = new List<GoodsReceivedItem>()
                };

                // GRN save karein pehle taake ID generate ho jaye
                await _grnRepo.AddAsync(grn, ct);
                await _grnRepo.SaveChangesAsync(ct);

                foreach (var item in request.Items)
                {
                    var poItem = await _poItemRepo.GetByIdAsync(item.PurchaseOrderItemId, ct);
                    if (poItem == null) continue;

                    // Over-receiving check
                    if ((poItem.ReceivedQuantity + item.QuantityReceived) > poItem.Quantity)
                    {
                        return ResponseDataModel<string>.FailureResponse($"Product {item.ProductId}: Over-receiving not allowed!");
                    }

                    var grnItem = new GoodsReceivedItem
                    {
                        GoodsReceivedId = grn.ID,
                        ProductId = item.ProductId,
                        QuantityReceived = item.QuantityReceived,
                        BatchNumber = item.BatchNumber,
                        ExpiryDate = item.ExpiryDate,
                        TenantId = _currentUser.TenantId,
                        BranchId = _currentUser.BranchId
                    };
                    grn.Items.Add(grnItem);

                    // 2. Received Quantity update karein (AWAIT lazmi hy)
                    poItem.ReceivedQuantity += item.QuantityReceived;
                    await _poItemRepo.UpdateAsync(poItem, ct); // Fixed: Added await

                    // 3. Stock Transaction record karein
                    var stockLog = new StockTransaction
                    {
                        ProductId = item.ProductId,
                        TransactionType = "GRN",
                        Quantity = item.QuantityReceived,
                        TransactionDate = DateTime.Now,
                        UnitPrice = poItem.UnitPrice,
                        ReferenceId = grn.ID,
                        Remarks = $"Received against PO #{request.POId} | Batch: {item.BatchNumber}",
                        TenantId = _currentUser.TenantId,
                        BranchId = _currentUser.BranchId
                    };
                    await _stockTransactionRepo.CreateStockTransaction(stockLog, ct);
                }

                await _grnRepo.SaveChangesAsync(ct);

                // 4. Transaction commit karein
                if (transaction != null) await transaction.CommitAsync(ct);

                return ResponseDataModel<string>.SuccessResponse("Success", "Goods Received and Stock updated successfully!");
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync(ct);
                return ResponseDataModel<string>.FailureResponse($"Error: {ex.Message}");
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
                TenantId = x.TenantId,
                BranchId = x.BranchId,
                WarehouseId = x.WarehouseId,
                Items = x.Items.Select(i => new GoodReceivedViewItemDto
                {
                    ID = i.ID,
                    GoodsReceivedId = i.GoodsReceivedId,
                    ProductId = i.ProductId,
                    QuantityReceived = i.QuantityReceived,
                    BatchNumber = i.BatchNumber,
                    ExpiryDate = i.ExpiryDate,
                    //WarehouseId = i.WarehouseId,
                    TenantId = i.TenantId,
                    BranchId = i.BranchId
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

        public Task<ResponseDataModel<PagedResponse<GoodReceivedViewDto>>> GetAllGoodReceiveds(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
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