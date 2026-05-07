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
    public class QuotationRepository : IQuotationInterface
    {
        private readonly DataContext _context;
        public QuotationRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<Quotation> CreateAsync(Quotation order, CancellationToken cancellationToken)
        {
            await _context.Set<Quotation>().AddAsync(order, cancellationToken);
            await _context.SaveChangesAsync();
            return order;
        }

        public  async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var order = await _context.Set<Quotation>()
                 .Include(x => x.QuotationItems)
                 .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);

            if (order == null) return false;

            _context.Set<Quotation>().Remove(order);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
       
      

        public async Task<List<Quotation>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Set<Quotation>()
                .Include(x=>x.Customer)
               .Include(x => x.QuotationItems)
               .AsNoTracking()
               .ToListAsync(cancellationToken);
        }

        public async Task<Quotation?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {

            return await _context.Set<Quotation>()
                .Include(x => x.QuotationItems)
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);
        }

        public async Task<Quotation> UpdateAsync(Quotation model, CancellationToken cancellationToken)
        {
            var existingOrder = await _context.Set<Quotation>()
             .Include(x => x.QuotationItems)
             .FirstOrDefaultAsync(x => x.ID == model.ID);

            if (existingOrder == null) throw new Exception("Purchase Order not found");

            _context.Entry(existingOrder).CurrentValues.SetValues(model);

            foreach (var existingItem in existingOrder.QuotationItems.ToList())
            {
                if (!model.QuotationItems.Any(i => i.ID == existingItem.ID))
                {
                    _context.Set<QuotationItem>().Remove(existingItem);
                }
            }
            foreach (var newItem in model.QuotationItems)
            {
                var existingItem = newItem.ID != 0
                    ? existingOrder.QuotationItems.FirstOrDefault(i => i.ID == newItem.ID)
                    : null;

                if (existingItem != null)
                {
                    _context.Entry(existingItem).CurrentValues.SetValues(newItem);
                }
                else
                {
                    newItem.ID = 0;
                    existingOrder.QuotationItems.Add(newItem);
                }
            }

            await _context.SaveChangesAsync(cancellationToken);
            return existingOrder;
        }
    }
}
