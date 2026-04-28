using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface ITenantInterface
    {
        Task<TenantSetting> CreateAsync(TenantSetting Role, CancellationToken cancellationToken);

        Task<TenantSetting?> GetByIdAsync(int id, CancellationToken cancellationToken);

        Task<List<TenantSetting>> GetAllAsync(CancellationToken cancellationToken);

        Task<TenantSetting> UpdateAsync(TenantSetting Role, CancellationToken cancellationToken);

        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
    }
}
