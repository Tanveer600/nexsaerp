using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IRoleService
    {
        Task<ResponseDataModel<Role>> CreateRoleAsync(Role Role, CancellationToken cancellationToken);

        Task<ResponseDataModel<List<Role>>> GetAllRolesAsync(CancellationToken cancellationToken);

        Task<ResponseDataModel<Role>> GetRoleByIdAsync(int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<Role>> UpdateRoleAsync(int id, Role Role, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeleteRoleAsync(int id, CancellationToken cancellationToken);
    }
}
