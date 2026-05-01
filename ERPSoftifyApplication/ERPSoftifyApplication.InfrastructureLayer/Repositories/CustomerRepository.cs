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
    public class CustomerRepository : ICustomerInterface
    {
        private readonly DataContext _dbcontext;
        public CustomerRepository(DataContext dataContext)
        {
            _dbcontext = dataContext;
        }
        public async Task<Customer> Create(Customer model, CancellationToken can)
        {
            await _dbcontext.Customers.AddAsync(model);
            await _dbcontext.SaveChangesAsync(can);
            return model;
        }

        public async Task<bool> DeleteCustomer(int Id, CancellationToken can)
        {
            var list = await _dbcontext.Customers.FirstOrDefaultAsync(c => c.ID == Id);
            if (list == null)
                return false;
            _dbcontext.Customers.Remove(list);
            await _dbcontext.SaveChangesAsync(can);
            return true;

        }

        public async Task<List<Customer>> GetAll(CancellationToken can)
        {
            var list = await _dbcontext.Customers.AsNoTracking().ToListAsync(can);
            return list;
        }

        public async Task<Customer> GetById(int Id, CancellationToken can)
        {
            var list = await _dbcontext.Customers.FirstOrDefaultAsync(c => c.ID == Id);
            return list;
        }

        public async Task<Customer> UpDateCustomer(Customer model, CancellationToken cancellationToken)
        {
            try
            {
                var list = await _dbcontext.Customers.Where(c => c.ID == model.ID).FirstOrDefaultAsync();
                if (list != null)

                    _dbcontext.Customers.Update(model);
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