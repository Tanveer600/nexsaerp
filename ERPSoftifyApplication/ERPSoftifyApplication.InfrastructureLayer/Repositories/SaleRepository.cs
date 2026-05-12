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
    public class SaleRepository : ISaleInterface
    {
        private readonly DataContext _context;
        public SaleRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<SalesOrder> CreateAsync(SalesOrder order, CancellationToken cancellationToken)
        {
            await _context.Set<SalesOrder>().AddAsync(order, cancellationToken);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var order = await _context.Set<SalesOrder>()
                 .Include(x => x.Items)
                 .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);

            if (order == null) return false;

            _context.Set<SalesOrder>().Remove(order);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<List<SalesOrder>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Set<SalesOrder>()
                .Include(x => x.Customer) 
                .Include(x => x.Items) 
                    .ThenInclude(i => i.Product) 
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<SalesOrder?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {

            return await _context.Set<SalesOrder>()
                .Include(x => x.Items)
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);
        }

        public async Task<SalesOrder> UpdateAsync(SalesOrder model, CancellationToken cancellationToken)
        {
            var existingOrder = await _context.Set<SalesOrder>()
             .Include(x => x.Items)
             .FirstOrDefaultAsync(x => x.ID == model.ID);

            if (existingOrder == null) throw new Exception("Purchase Order not found");

            _context.Entry(existingOrder).CurrentValues.SetValues(model);

            foreach (var existingItem in existingOrder.Items.ToList())
            {
                if (!model.Items.Any(i => i.ID == existingItem.ID))
                {
                    _context.Set<SalesOrderItem>().Remove(existingItem);
                }
            }
            foreach (var newItem in model.Items)
            {
                var existingItem = newItem.ID != 0
                    ? existingOrder.Items.FirstOrDefault(i => i.ID == newItem.ID)
                    : null;

                if (existingItem != null)
                {
                    _context.Entry(existingItem).CurrentValues.SetValues(newItem);
                }
                else
                {
                    newItem.ID = 0;
                    existingOrder.Items.Add(newItem);
                }
            }

            await _context.SaveChangesAsync(cancellationToken);
            return existingOrder;
        }
    }
}
