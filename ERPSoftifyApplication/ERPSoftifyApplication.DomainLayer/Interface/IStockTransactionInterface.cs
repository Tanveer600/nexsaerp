using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IStockTransactionInterface
    {
        Task<List<StockTransaction>> GetAll(CancellationToken can);
        Task<StockTransaction> GetById(int Id, CancellationToken can);
        Task<bool> DeleteStockTransaction(int Id, CancellationToken can);
        Task<StockTransaction> UpDateStockTransaction(StockTransaction model, CancellationToken can);
        Task<StockTransaction> CreateStockTransaction(StockTransaction model, CancellationToken can);
        Task<int> SaveChangesAsync(CancellationToken ct); 
    }
}
