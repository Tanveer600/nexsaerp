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

        public async Task<PurchaseOrder> CreateAsync(PurchaseOrder PurchaseOrder, CancellationToken cancellationToken)
        {
            await _context.PurchaseOrders.AddAsync(PurchaseOrder, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return PurchaseOrder;
        }

        public async Task<PurchaseOrder?> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.PurchaseOrders
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);
        }

        public async Task<List<PurchaseOrder>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _context.PurchaseOrders
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<PurchaseOrder> UpdateAsync(PurchaseOrder PurchaseOrder, CancellationToken cancellationToken)
        {
            _context.PurchaseOrders.Update(PurchaseOrder);
            await _context.SaveChangesAsync(cancellationToken);

            return PurchaseOrder;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var entity = await _context.PurchaseOrders
                .FirstOrDefaultAsync(x => x.ID == id, cancellationToken);

            if (entity == null)
                return false;

            _context.PurchaseOrders.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
