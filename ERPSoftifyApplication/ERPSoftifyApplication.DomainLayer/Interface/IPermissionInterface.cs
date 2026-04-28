using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IPermissionInterface
    {
        Task<Permission> CreateAsync(Permission permission, CancellationToken cancellationToken);

        Task<Permission?> GetByIdAsync(int id, CancellationToken cancellationToken);

        Task<List<Permission>> GetAllAsync(CancellationToken cancellationToken);

        Task<Permission> UpdateAsync(Permission permission, CancellationToken cancellationToken);

        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
    }
}
