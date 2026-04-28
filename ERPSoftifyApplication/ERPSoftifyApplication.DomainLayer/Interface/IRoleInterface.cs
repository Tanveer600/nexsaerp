using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IRoleInterface
    {
        Task<Role> CreateAsync(Role Role, CancellationToken cancellationToken);

        Task<Role?> GetByIdAsync(int id, CancellationToken cancellationToken);

        Task<List<Role>> GetAllAsync(CancellationToken cancellationToken);

        Task<Role> UpdateAsync(Role Role, CancellationToken cancellationToken);

        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
    }
}
