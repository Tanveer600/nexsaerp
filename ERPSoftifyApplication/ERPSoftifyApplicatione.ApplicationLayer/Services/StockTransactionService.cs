using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.DeliveryNoteDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.StockTransactionDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class StockTransactionService : IStockTransactionService
    {
        private readonly IStockTransactionInterface _stockRepo;
        private readonly ICurrentUserService _currentUser;

        public StockTransactionService(IStockTransactionInterface stockRepo, ICurrentUserService currentUser)
        {
            _stockRepo = stockRepo;
            _currentUser = currentUser;
        }

        public async Task<StockTransaction> CreateTransaction(StockTransactionDto dto, CancellationToken ct)
        {
            var entity = new StockTransaction
            {
                ProductId = dto.ProductId,
                TransactionType = dto.TransactionType,
                Quantity = dto.Quantity,
                UnitPrice = dto.UnitPrice,
                TransactionDate = DateTime.Now,
                Remarks = dto.Remarks,
                BranchId = _currentUser.BranchId,
                TenantId = _currentUser.TenantId
            };

            var result = await _stockRepo.CreateStockTransaction(entity, ct);
            await _stockRepo.SaveChangesAsync(ct);
            return result;
        }

        public async Task<StockTransaction> UpdateTransaction(int id,UpdateStockTransactionDto dto, CancellationToken ct)
        {
            var existing = await _stockRepo.GetById(dto.ID, ct);
            if (existing == null) return null;

            existing.ProductId = dto.ProductId;
            existing.TransactionType = dto.TransactionType;
            existing.Quantity = dto.Quantity;
            existing.UnitPrice = dto.UnitPrice;
            existing.Remarks = dto.Remarks;
            existing.TransactionDate = dto.TransactionDate;
                

            var result = await _stockRepo.UpDateStockTransaction(existing, ct);
            await _stockRepo.SaveChangesAsync(ct);
            return result;
        }

        public async Task<ResponseDataModel<PagedResponse<StockTransactionDto>>> GetAllTransactionsAsync(int pageNumber, int pageSize, CancellationToken ct)
        {
            // Repository se data fetch karte waqt Product ko Include karein
            var query = await _stockRepo.GetAll(ct);

            var totalCount = query.Count();

            var items = query
                .OrderByDescending(x => x.ID)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new StockTransactionDto
                {
                    ID = x.ID,
                    ProductName =x.Product?.Name,
                    TransactionType = x.TransactionType,
                    Quantity = x.Quantity,
                    UnitPrice = x.UnitPrice,
                    TransactionDate = x.TransactionDate,
                    Remarks = x.Remarks,
                    ReferenceId = x.ReferenceId
                })
                .ToList();

            var pagedData = new PagedResponse<StockTransactionDto>
            {
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize,
                Items = items
            };

            return ResponseDataModel<PagedResponse<StockTransactionDto>>.SuccessResponse(pagedData);
        }

        public async Task<StockTransaction> GetTransactionById(int id, CancellationToken ct)
        {
            return await _stockRepo.GetById(id, ct);
        }

        public async Task<bool> DeleteTransaction(int id, CancellationToken ct)
        {
            var result = await _stockRepo.DeleteStockTransaction(id, ct);
            if (result) await _stockRepo.SaveChangesAsync(ct);
            return result;
        }
    }
}
