using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface ISalesOrderItemInterface
    {
        Task<SalesOrderItem?> GetByIdAsync(int id, CancellationToken cancellationToken);

        void Update(SalesOrderItem entity);
        Task<List<SalesOrderItem>> GetPendingItemsByOrderIdAsync(int saleOrderId, CancellationToken ct);
        Task<SalesOrderItem> UpdateFullOrderAsync(SalesOrderItem model, CancellationToken ct);
    }
}
