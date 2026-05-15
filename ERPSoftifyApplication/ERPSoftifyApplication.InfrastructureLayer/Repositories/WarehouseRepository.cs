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
    public class WarehouseRepository : IWarehouseInterface
    {
        private readonly DataContext _dbcontext;
        public WarehouseRepository(DataContext dataContext)
        {
            _dbcontext = dataContext;
        }
        public async Task<Warehouse> CreateWarehouse(Warehouse model, CancellationToken can)
        {
            await _dbcontext.Warehouses.AddAsync(model);
            await _dbcontext.SaveChangesAsync();
            return model;
        }

        public async Task<bool> DeleteWarehouse(int Id, CancellationToken can)
        {
            var list = await _dbcontext.Warehouses.FirstOrDefaultAsync(c => c.ID == Id);
            if (list == null)
                return false;
            _dbcontext.Warehouses.Remove(list);
            await _dbcontext.SaveChangesAsync(can);
            return true;

        }

        public async Task<List<Warehouse>> GetAll(CancellationToken can)
        {
            var list = await _dbcontext.Warehouses.AsNoTracking().ToListAsync(can);
            return list;
        }

        public async Task<Warehouse> GetById(int Id, CancellationToken can)
        {
            var list = await _dbcontext.Warehouses.FirstOrDefaultAsync(c => c.ID == Id);
            return list;
        }

        public async Task<Warehouse> UpDateWarehouse(Warehouse model, CancellationToken cancellationToken)
        {
            var list = await _dbcontext.Warehouses.Where(c => c.ID == model.ID).FirstOrDefaultAsync();
            if (list != null)

                _dbcontext.Warehouses.Update(model);
            await _dbcontext.SaveChangesAsync();
            return model;

        }
    }
}
