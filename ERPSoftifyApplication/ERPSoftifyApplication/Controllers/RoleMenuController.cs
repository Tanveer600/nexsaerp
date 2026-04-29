using ERPSoftifyApplicatione.ApplicationLayer.DTO;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleMenuController : ControllerBase
    {
        private readonly IRoleMenuPermissionService _service;

        public RoleMenuController(IRoleMenuPermissionService service)
        {
            _service = service;
        }

        [HttpPost("assign-permissions")]
        public async Task<IActionResult> AssignMenus([FromBody] AssignRoleMenusDto dto, CancellationToken cancellationToken)
        {
            if (dto == null || dto.RoleId <= 0)
                return BadRequest("Invalid request data.");

            var result = await _service.AssignRoleMenusAsync(dto, cancellationToken);

            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("by-role/{roleId}")]
        public async Task<IActionResult> GetMenusByRoleId(int roleId, CancellationToken cancellationToken)
        {
            var result = await _service.GetMenusByRoleIdAsync(roleId, cancellationToken);

            return result.Success ? Ok(result) : NotFound(result);
        }

        [HttpGet("all-assignments")]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _service.GetAllAssignedPermissionsAsync(cancellationToken);
            return Ok(result);
        }
        [HttpDelete("remove-permission/{id}")]
        public async Task<IActionResult> RemovePermission(int id, CancellationToken cancellationToken)
        {
            var result = await _service.DeleteRolePermissionAsync(id, cancellationToken);

            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}