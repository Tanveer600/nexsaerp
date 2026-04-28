using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IMenuInterface
    {
        Task<Menu> CreateAsync(Menu Menu, CancellationToken cancellationToken);

        Task<Menu?> GetByIdAsync(int id, CancellationToken cancellationToken);

        Task<List<Menu>> GetAllAsync(CancellationToken cancellationToken);

        Task<Menu> UpdateAsync(Menu Menu, CancellationToken cancellationToken);

        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
        Task<List<Menu>> GetMenusByRoleIdAsync(int roleId, CancellationToken cancellationToken);
    }
}
