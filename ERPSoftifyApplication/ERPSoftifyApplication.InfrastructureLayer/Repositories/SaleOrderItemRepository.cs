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
    public class SaleOrderItemRepository:ISalesOrderItemInterface
    {
        private readonly DataContext _context;

        public SaleOrderItemRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<SalesOrderItem?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.SalesOrderItems
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);
        }

        public void Update(SalesOrderItem entity)
        {
            _context.SalesOrderItems.Update(entity);
        }

        public async Task<List<SalesOrderItem>> GetPendingItemsByOrderIdAsync(int saleOrderId, CancellationToken ct)
        {
            return await _context.SalesOrderItems
                .Where(x => x.SOId == saleOrderId && x.DeliveredQuantity < x.Quantity)
                .ToListAsync(ct);
        }

        public async Task<SalesOrderItem> UpdateFullOrderAsync(SalesOrderItem model, CancellationToken ct)
        {
            var existing = await _context.SalesOrderItems
                .FirstOrDefaultAsync(x => x.ID == model.ID, ct);

            if (existing == null) throw new Exception("Item not found");

            _context.Entry(existing).CurrentValues.SetValues(model);
            await _context.SaveChangesAsync(ct);
            return existing;
        }
    }
}
