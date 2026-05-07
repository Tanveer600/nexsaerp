using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface ISaleInterface
    {
        Task<SalesOrder> CreateAsync(SalesOrder model, CancellationToken cancellationToken);
        Task<SalesOrder?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<List<SalesOrder>> GetAllAsync(CancellationToken cancellationToken);
        Task<SalesOrder> UpdateAsync(SalesOrder model, CancellationToken cancellationToken);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
    }
}
