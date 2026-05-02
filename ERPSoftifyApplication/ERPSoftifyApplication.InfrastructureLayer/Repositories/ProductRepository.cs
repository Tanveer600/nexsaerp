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
    public class ProductRepository:IProductInterface
    {
        private readonly DataContext _dbcontext;
        public ProductRepository(DataContext dataContext)
        {
            _dbcontext = dataContext;
        }
        public async Task<Product> CreateProduct(Product model, CancellationToken can)
        {
            await _dbcontext.Products.AddAsync(model);
            await _dbcontext.SaveChangesAsync(can);
            return model;
        }

        public async Task<bool> DeleteProduct(int Id, CancellationToken can)
        {
            var list = await _dbcontext.Products.FirstOrDefaultAsync(c => c.ID == Id);
            if (list == null)
                return false;
            _dbcontext.Products.Remove(list);
            await _dbcontext.SaveChangesAsync(can);
            return true;

        }

        public async Task<List<Product>> GetAll(CancellationToken can)
        {
            var list = await _dbcontext.Products.AsNoTracking().ToListAsync(can);
            return list;
        }

        public async Task<Product> GetById(int Id, CancellationToken can)
        {
            var list = await _dbcontext.Products.FirstOrDefaultAsync(c => c.ID == Id);
            return list;
        }

        public async Task<Product> UpDateProduct(Product model, CancellationToken cancellationToken)
        {
            try
            {
                var list = await _dbcontext.Products.Where(c => c.ID == model.ID).FirstOrDefaultAsync();
                if (list != null)

                    _dbcontext.Products.Update(model);
                await _dbcontext.SaveChangesAsync();
                return model;
            }
            catch (Exception ex)
            {

                throw;
            }

        }
    }
}
