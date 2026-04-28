using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IPurchaseOrderItemItemInterface
    {
        Task<PurchaseOrderItem> CreateAsync(PurchaseOrderItem permission, CancellationToken cancellationToken);

        Task<PurchaseOrderItem?> GetByIdAsync(int id, CancellationToken cancellationToken);

        Task<List<PurchaseOrderItem>> GetAllAsync(CancellationToken cancellationToken);

        Task<PurchaseOrderItem> UpdateAsync(PurchaseOrderItem permission, CancellationToken cancellationToken);

        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
    }
}
