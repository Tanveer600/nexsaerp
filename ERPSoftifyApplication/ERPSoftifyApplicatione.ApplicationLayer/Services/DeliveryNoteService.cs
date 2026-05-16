using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.DeliveryNoteDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class DeliveryNoteService : IDeliveryNoteService
    {
        private readonly IDeliveryNoteInterface _deliveryRepo;
        private readonly ISalesOrderItemInterface _soItemRepo;
        private readonly IStockTransactionInterface _stockTransactionRepo;
        private readonly ICurrentUserService _currentUser;

        public DeliveryNoteService(IDeliveryNoteInterface deliveryRepo,ISalesOrderItemInterface soItemRepo, IStockTransactionInterface stockTransactionRepo,
            ICurrentUserService currentUser)
        {
            _deliveryRepo = deliveryRepo;
            _soItemRepo = soItemRepo;
            _stockTransactionRepo = stockTransactionRepo;
            _currentUser = currentUser;
        }

        public async Task<List<DeliveryNoteRequestDto>> GetAllDeliveryNotes(CancellationToken ct)
        {
            var list = await _deliveryRepo.GetAll(ct); 
            return list.Select(x => new DeliveryNoteRequestDto
            {
                SaleOrderId = x.SaleOrderId,
                DeliveryDate = x.DeliveryDate,
                Remarks = x.Remarks,
            }).ToList();
        }
        public async Task<ResponseDataModel<PagedResponse<DeliveryNoteRequestDto>>> GetAllDeliveryNotes(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = await _deliveryRepo.GetAll(cancellationToken);

            var totalCount = query.Count();

            var Products = query.OrderByDescending(x => x.ID).Skip((pageNumber - 1) * pageSize).Take(pageSize)
                           .Select(dto => new DeliveryNoteRequestDto
                           {
                               ID = dto.ID,
                               SaleOrderId = dto.SaleOrderId,
                               DeliveryDate = dto.DeliveryDate,
                               Remarks = dto.Remarks,
                           }).ToList();

            var pagedData = new PagedResponse<DeliveryNoteRequestDto>
            {
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize,
                Items = Products
            };

            return ResponseDataModel<PagedResponse<DeliveryNoteRequestDto>>.SuccessResponse(pagedData);
        }

        public async Task<DeliveryNoteRequestDto> GetDeliveryNoteById(int id, CancellationToken ct)
        {
            var x = await _deliveryRepo.GetByIdAsync(id, ct);
            if (x == null) return null;

            return new DeliveryNoteRequestDto
            {
                SaleOrderId = x.SaleOrderId,
                DeliveryDate = x.DeliveryDate,
                Remarks = x.Remarks
            };
        }

        public async Task<DeliveryNoteItemDto> CreateManualDeliveryNote(DeliveryNoteItemDto dto, CancellationToken ct)
        {
            var stockLog = new StockTransaction
            {
                ProductId = dto.ProductId,
                Quantity = dto.CurrentQty,
                TransactionType = "Manual",
                TransactionDate = DateTime.Now,
               // WarehouseId=dto.WarehouseId
                TenantId = _currentUser.TenantId,
                BranchId = _currentUser.BranchId
            };

            await _stockTransactionRepo.CreateStockTransaction(stockLog, ct);
            await _stockTransactionRepo.SaveChangesAsync(ct);
            return dto;
        }

        public async Task<bool> DeleteDeliveryNote(int id, CancellationToken ct)
        {
            var result = await _deliveryRepo.DeleteDeliveryNote(id, ct);
            return result;
        }

        public async Task<ResponseDataModel<string>> CreateDeliveryNote(DeliveryNoteRequestDto request, CancellationToken ct)
        {
            using var transaction = await _deliveryRepo.BeginTransactionAsync(ct) as IDbContextTransaction;

            if (transaction == null)
                return ResponseDataModel<string>.FailureResponse("Database transaction could not be started.");

            try
            {
                var delivery = new DeliveryNote
                {
                    SaleOrderId = request.SaleOrderId,
                    DeliveryDate = request.DeliveryDate,
                    Remarks = request.Remarks,
                    Status = "Delivered",
                    WarehouseId=request.WarehouseId,
                    TenantId = _currentUser.TenantId,
                    BranchId = _currentUser.BranchId,
                    DeliveryNoteItems = new List<DeliveryNoteItem>()
                };

                await _deliveryRepo.AddAsync(delivery, ct);
                await _deliveryRepo.SaveChangesAsync(CancellationToken.None);
                foreach (var item in request.Items)
                {
                    var soItem = await _soItemRepo.GetByIdAsync(item.SalesOrderItemId, ct);
                    if (soItem == null) continue;
                    if ((soItem.DeliveredQuantity + item.CurrentQty) > soItem.Quantity)
                    {
                        return ResponseDataModel<string>.FailureResponse($"Over-delivery for Product {item.ProductId} not allowed!");
                    }

                    delivery.DeliveryNoteItems.Add(new DeliveryNoteItem
                    {
                        SalesOrderItemId = item.SalesOrderItemId,
                        ProductId = item.ProductId,
                        QuantityDelivered = item.CurrentQty,
                        TenantId = _currentUser.TenantId
                    });

                    soItem.DeliveredQuantity += item.CurrentQty;
                    _soItemRepo.Update(soItem);
                    var stockLog = new StockTransaction
                    {
                        ProductId = item.ProductId,
                        TransactionType = "Delivery",
                        Quantity = item.CurrentQty,
                        WarehouseId = request.WarehouseId,
                        TransactionDate = DateTime.Now,
                        UnitPrice=soItem.UnitPrice,
                        ReferenceId=delivery.ID,
                        Remarks = $"Delivered against SO #{request.SaleOrderId}",
                        TenantId = _currentUser.TenantId,
                        BranchId = _currentUser.BranchId
                    };
                    await _stockTransactionRepo.CreateStockTransaction(stockLog, ct);
                }

                await _deliveryRepo.SaveChangesAsync(ct);
                await transaction.CommitAsync(ct);

                return ResponseDataModel<string>.SuccessResponse("Success", "Delivery processed successfully!");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(ct);
                return ResponseDataModel<string>.FailureResponse($"Error: {ex.Message}");
            }
        }

        public async Task<int> SaveChangesAsync(CancellationToken ct)
        {
            return await _stockTransactionRepo.SaveChangesAsync(ct);
        }
    }
}