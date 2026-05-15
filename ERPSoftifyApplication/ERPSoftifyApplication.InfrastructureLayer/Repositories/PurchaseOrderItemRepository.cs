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
    public class PurchaseOrderItemRepository:IPurchaseOrderItemInterface
    {

        private readonly DataContext _context;

        public PurchaseOrderItemRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<PurchaseOrderItem> CreateAsync(PurchaseOrderItem PurchaseOrderItem, CancellationToken cancellationToken)
        {
            await _context.PurchaseOrderItems.AddAsync(PurchaseOrderItem, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return PurchaseOrderItem;
        }

        public async Task<PurchaseOrderItem?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.PurchaseOrderItems
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);
        }

        public async Task<List<PurchaseOrderItem>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.PurchaseOrderItems
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public void Update(PurchaseOrderItem PurchaseOrderItem)
        {
            _context.PurchaseOrderItems.Update(PurchaseOrderItem);      
        }
        public async Task<PurchaseOrderItem> UpdateAsync(PurchaseOrderItem model, CancellationToken ct)
        {
            var existing = await _context.PurchaseOrderItems
                .FirstOrDefaultAsync(x => x.ID == model.ID, ct);

            if (existing == null) throw new Exception("Item not found");

            _context.Entry(existing).CurrentValues.SetValues(model);
            // await _context.SaveChangesAsync(ct);
            return existing;
        }
        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var entity = await _context.PurchaseOrderItems
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);

            if (entity == null)
                return false;

            _context.PurchaseOrderItems.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
