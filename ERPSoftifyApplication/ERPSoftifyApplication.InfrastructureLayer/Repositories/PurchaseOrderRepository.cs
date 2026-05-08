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
    public class PurchaseOrderRepository:IPurchaseOrderInterface
    {

        private readonly DataContext _context;

        public PurchaseOrderRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<PurchaseOrder> CreateAsync(PurchaseOrder order, CancellationToken cancellationToken)
        {
            await _context.Set<PurchaseOrder>().AddAsync(order, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return order;
        }

        public async Task<PurchaseOrder?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.Set<PurchaseOrder>()
                .Include(x=>x.Vendor)
                .Include(x => x.Items)
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);
        }

        public async Task<List<PurchaseOrder>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.Set<PurchaseOrder>()
              
                .Include(x => x.Items)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<PurchaseOrder> UpdateAsync(PurchaseOrder order, CancellationToken cancellationToken)
        {
            var existingOrder = await _context.Set<PurchaseOrder>()
                .Include(x => x.Items)
                .FirstOrDefaultAsync(x => x.ID == order.ID);

            if (existingOrder == null) throw new Exception("Purchase Order not found");

            _context.Entry(existingOrder).CurrentValues.SetValues(order);

            foreach (var existingItem in existingOrder.Items.ToList())
            {
                if (!order.Items.Any(i => i.ID == existingItem.ID))
                {
                    _context.Set<PurchaseOrderItem>().Remove(existingItem);
                }
            }
            foreach (var newItem in order.Items)
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

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var order = await _context.Set<PurchaseOrder>()
                .Include(x => x.Items)
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);

            if (order == null) return false;

            _context.Set<PurchaseOrder>().Remove(order);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
