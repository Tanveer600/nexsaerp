using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.InfrastructureLayer.Repositories
{
    public class StockTransactionRepository:IStockTransactionInterface
    {
        private readonly DataContext _dbcontext;
        public StockTransactionRepository(DataContext dataContext)
        {
            _dbcontext = dataContext;
        }

        public async Task<StockTransaction> CreateStockTransaction(StockTransaction model, CancellationToken can)
        {
            await _dbcontext.StockTransactions.AddAsync(model);
            return model;
        }

        public async Task<bool> DeleteStockTransaction(int Id, CancellationToken can)
        {
            var list = await _dbcontext.StockTransactions.FirstOrDefaultAsync(c => c.ID == Id);
            if (list == null)
                return false;
            _dbcontext.StockTransactions.Remove(list);
            return true;

        }

        public async Task<List<StockTransaction>> GetAll(CancellationToken can)
        {
            var list = await _dbcontext.StockTransactions.AsNoTracking().ToListAsync(can);
            return list;
        }

        public async Task<StockTransaction> GetById(int Id, CancellationToken can)
        {
            var list = await _dbcontext.StockTransactions.FirstOrDefaultAsync(c => c.ID == Id);
            return list;
        }
        public async Task<StockTransaction> UpDateStockTransaction(StockTransaction model, CancellationToken cancellationToken)
        {
            try
            {
                var list = await _dbcontext.StockTransactions.Where(c => c.ID == model.ID).FirstOrDefaultAsync();
                if (list != null)

                    _dbcontext.StockTransactions.Update(model);
                return model;
            }
            catch (Exception ex)
            {

                throw;
            }

        }
        public async Task<int> SaveChangesAsync(CancellationToken ct)
        {
            return await _dbcontext.SaveChangesAsync(ct);
        }


    }
}
