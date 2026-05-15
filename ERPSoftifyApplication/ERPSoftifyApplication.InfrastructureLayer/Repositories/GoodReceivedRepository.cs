using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.InfrastructureLayer.Repositories
{
    public class GoodReceivedRepository : IGoodReceivedInterface
    {
        private readonly DataContext _dbcontext;
        public GoodReceivedRepository(DataContext context) => _dbcontext = context;

        public async Task AddAsync(GoodsReceived entity, CancellationToken ct)
        {
            await _dbcontext.GoodsReceiveds.AddAsync(entity, ct);
        }

        public async Task<GoodsReceived> GetByIdAsync(int id, CancellationToken ct)
        {
            var goodRecivedList= await _dbcontext.GoodsReceiveds
                .Include(x => x.Items)
                .FirstOrDefaultAsync(x => x.ID == id, ct);
            return goodRecivedList;
        }

        public async Task<GoodsReceived> CreateGoodsReceived(GoodsReceived model, CancellationToken can)
        {
            await _dbcontext.GoodsReceiveds.AddAsync(model, can);
            return model;
        }

        public async Task<object> BeginTransactionAsync(CancellationToken ct)
        {
            return await _dbcontext.Database.BeginTransactionAsync(ct);
        }

        public async Task<bool> DeleteGoodsReceived(int Id, CancellationToken can)
        {
            var record = await _dbcontext.GoodsReceiveds.FirstOrDefaultAsync(c => c.ID == Id, can);
            if (record == null)
                return false;

            _dbcontext.GoodsReceiveds.Remove(record);
            //await _dbcontext.SaveChangesAsync(can);
            return true;
        }

        public async Task<List<GoodsReceived>> GetAll(CancellationToken can)
        {
          
            return await _dbcontext.GoodsReceiveds.AsNoTracking().ToListAsync(can);
        }

        public async Task<GoodsReceived> UpDateGoodsReceived(GoodsReceived model, CancellationToken can)
        {
            _dbcontext.GoodsReceiveds.Update(model);
            //await _dbcontext.SaveChangesAsync(can);
            return model;
        }

        public async Task<int> SaveChangesAsync(CancellationToken ct)
        {
            return await _dbcontext.SaveChangesAsync(ct);
        }
    }
}