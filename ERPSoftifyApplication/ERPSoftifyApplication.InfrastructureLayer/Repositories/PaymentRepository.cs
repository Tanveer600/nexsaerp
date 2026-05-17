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
    public class PaymentRepository:IPaymentInterface
    {
        private readonly DataContext _dbcontext;
        public PaymentRepository(DataContext dataContext)
        {
            _dbcontext = dataContext;
        }
        public async Task<Payment> Create(Payment model, CancellationToken can)
        {
            await _dbcontext.Payments.AddAsync(model);
            await _dbcontext.SaveChangesAsync(can);
            return model;
        }

        public async Task<bool> DeletePayment(int Id, CancellationToken can)
        {
            var list = await _dbcontext.Payments.FirstOrDefaultAsync(c => c.ID == Id);
            if (list == null)
                return false;
            _dbcontext.Payments.Remove(list);
            await _dbcontext.SaveChangesAsync(can);
            return true;

        }

        public async Task<List<Payment>> GetAll(CancellationToken can)
        {
            var list = await _dbcontext.Payments.AsNoTracking().ToListAsync(can);
            return list;
        }

        public async Task<Payment> GetById(int Id, CancellationToken can)
        {
            var list = await _dbcontext.Payments.FirstOrDefaultAsync(c => c.ID == Id);
            return list;
        }

        public async Task<Payment> UpDatePayment(Payment model, CancellationToken cancellationToken)
        {
            try
            {
                var list = await _dbcontext.Payments.Where(c => c.ID == model.ID).FirstOrDefaultAsync();
                if (list != null)

                    _dbcontext.Payments.Update(model);
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
