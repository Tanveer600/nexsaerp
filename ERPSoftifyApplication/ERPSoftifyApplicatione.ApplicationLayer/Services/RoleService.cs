using ERPSoftifyApplication.DomainLayer;
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
    public class RoleService:IRoleService
    {
        private readonly IRoleInterface _RoleRepository;

        public RoleService(IRoleInterface userRepository)
        {
            _RoleRepository = userRepository;
        }

        public async Task<ResponseDataModel<Role>> CreateRoleAsync(
            Role Role,
            CancellationToken cancellationToken)
        {
            //Role.CreatedAt = DateTime.UtcNow;

            var result = await _RoleRepository.CreateAsync(Role, cancellationToken);

            return ResponseDataModel<Role>.SuccessResponse(result, "Role created successfully");
        }

        public async Task<ResponseDataModel<List<Role>>> GetAllRolesAsync(
            CancellationToken cancellationToken)
        {
            var result = await _RoleRepository.GetAllAsync(cancellationToken);

            return ResponseDataModel<List<Role>>.SuccessResponse(result);
        }

        public async Task<ResponseDataModel<Role>> GetRoleByIdAsync(
            int id,
            CancellationToken cancellationToken)
        {
            var Role = await _RoleRepository.GetByIdAsync(id, cancellationToken);

            if (Role == null)
                return ResponseDataModel<Role>.FailureResponse("Role not found");

            return ResponseDataModel<Role>.SuccessResponse(Role);
        }

        public async Task<ResponseDataModel<Role>> UpdateRoleAsync(
            int id,
            Role Role,
            CancellationToken cancellationToken)
        {
            var existing = await _RoleRepository.GetByIdAsync(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<Role>.FailureResponse("Role not found");

            existing.RoleName = Role.RoleName;
            existing.Description = Role.Description;
            existing.TenantId = Role.TenantId;
            

            var updated = await _RoleRepository.UpdateAsync(existing, cancellationToken);

            return ResponseDataModel<Role>.SuccessResponse(updated, "Role updated successfully");
        }

        public async Task<ResponseDataModel<bool>> DeleteRoleAsync(
            int id,
            CancellationToken cancellationToken)
        {
            var exists = await _RoleRepository.GetByIdAsync(id, cancellationToken);

            if (exists == null)
                return ResponseDataModel<bool>.FailureResponse("Role not found");

            var deleted = await _RoleRepository.DeleteAsync(id, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(deleted, "Role deleted successfully");
        }

    }
}
