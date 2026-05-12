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
    public class CategoryRepository : ICategoryInterface
    {
        private readonly DataContext _dbcontext;
        public CategoryRepository(DataContext dataContext)
        {
            _dbcontext = dataContext;
        }
        public async Task<Category> Create(Category model, CancellationToken can)
        {
            await _dbcontext.Categorys.AddAsync(model);
            await _dbcontext.SaveChangesAsync(can);
            return model;
        }

        public async Task<bool> DeleteCategory(int Id, CancellationToken can)
        {
            var list = await _dbcontext.Categorys.FirstOrDefaultAsync(c => c.ID == Id);
            if (list == null)
                return false;
            _dbcontext.Categorys.Remove(list);
            await _dbcontext.SaveChangesAsync(can);
            return true;

        }

        public async Task<List<Category>> GetAll(CancellationToken can)
        {
            var list = await _dbcontext.Categorys.AsNoTracking().ToListAsync(can);
            return list;
        }

        public async Task<Category> GetById(int Id, CancellationToken can)
        {
            var list = await _dbcontext.Categorys.FirstOrDefaultAsync(c => c.ID == Id);
            return list;
        }

        public async Task<Category> UpDateCategory(Category model, CancellationToken cancellationToken)
        {
            try
            {
                var list = await _dbcontext.Categorys.Where(c => c.ID == model.ID).FirstOrDefaultAsync();
                if (list != null)

                    _dbcontext.Categorys.Update(model);
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
