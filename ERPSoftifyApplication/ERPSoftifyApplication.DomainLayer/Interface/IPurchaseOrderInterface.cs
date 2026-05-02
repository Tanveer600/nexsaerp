using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IPurchaseOrderInterface
    {
        Task<PurchaseOrder> CreateAsync(PurchaseOrder order, CancellationToken cancellationToken);
        Task<PurchaseOrder?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<List<PurchaseOrder>> GetAllAsync(CancellationToken cancellationToken);
        Task<PurchaseOrder> UpdateAsync(PurchaseOrder order, CancellationToken cancellationToken);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
    }
}
