using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.StockTransactionDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IStockTransactionService
    {
        Task<ResponseDataModel<PagedResponse<StockTransactionDto>>> GetAllTransactionsAsync(int pageNumber, int pageSize, CancellationToken ct);
        Task<StockTransaction> GetTransactionById(int id, CancellationToken ct);
        Task<StockTransaction> CreateTransaction(StockTransactionDto model, CancellationToken ct);
        Task<StockTransaction> UpdateTransaction(int id,UpdateStockTransactionDto model, CancellationToken ct);
        Task<bool> DeleteTransaction(int id, CancellationToken ct);
    }
}
