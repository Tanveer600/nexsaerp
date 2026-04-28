using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IBranchInterface
    {
        Task<Branch> CreateAsync(Branch Role, CancellationToken cancellationToken);

        Task<Branch?> GetByIdAsync(int id, CancellationToken cancellationToken);

        Task<List<Branch>> GetAllAsync(CancellationToken cancellationToken);

        Task<Branch> UpdateAsync(Branch Role, CancellationToken cancellationToken);

        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
    }
}
