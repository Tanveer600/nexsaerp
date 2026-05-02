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
    public class VendorRepository:IVendorInterface
    {
        private readonly DataContext _dbcontext;
        public VendorRepository(DataContext dataContext)
        {
            _dbcontext = dataContext;
        }
        public async Task<Vendor> Create(Vendor model, CancellationToken can)
        {
            await _dbcontext.Vendors.AddAsync(model);
            await _dbcontext.SaveChangesAsync(can);
            return model;
        }

        public async Task<bool> DeleteVendor(int Id, CancellationToken can)
        {
            var list = await _dbcontext.Vendors.FirstOrDefaultAsync(c => c.ID == Id);
            if (list == null)
                return false;
            _dbcontext.Vendors.Remove(list);
            await _dbcontext.SaveChangesAsync(can);
            return true;

        }

        public async Task<List<Vendor>> GetAll(CancellationToken can)
        {
            var list = await _dbcontext.Vendors.AsNoTracking().ToListAsync(can);
            return list;
        }

        public async Task<Vendor> GetById(int Id, CancellationToken can)
        {
            var list = await _dbcontext.Vendors.FirstOrDefaultAsync(c => c.ID == Id);
            return list;
        }

        public async Task<Vendor> UpDateVendor(Vendor model, CancellationToken cancellationToken)
        {
            try
            {
                var list = await _dbcontext.Vendors.Where(c => c.ID == model.ID).FirstOrDefaultAsync();
                if (list != null)

                    _dbcontext.Vendors.Update(model);
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
