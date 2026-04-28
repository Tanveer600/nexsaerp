using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class RoleMenuService:IRoleMenuService
    {
        private readonly IRoleMenuInterface _repository;

        public RoleMenuService(IRoleMenuInterface repository)
        {
            _repository = repository;
        }

        public async Task AssignMenusAsync(int roleId, List<int> menuIds, CancellationToken cancellationToken)
        {
            await _repository.AssignMenusAsync(roleId, menuIds, cancellationToken);
        }

        public async Task<List<Menu>> GetMenusByRoleAsync(int roleId, CancellationToken cancellationToken)
        {
            return await _repository.GetMenusByRoleAsync(roleId, cancellationToken);
        }

        public async Task RemoveMenuAsync(int roleId, int menuId, CancellationToken cancellationToken)
        {
            await _repository.RemoveMenuAsync(roleId, menuId, cancellationToken);
        }

        public async Task<List<RoleMenu>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _repository.GetAllAsync(cancellationToken);
        }
    }
}
