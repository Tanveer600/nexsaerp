using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleMenuController : ControllerBase
    {
        private readonly IRoleMenuService _service;

        public RoleMenuController(IRoleMenuService service)
        {
            _service = service;
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignMenus(int roleId, List<int> menuIds, CancellationToken cancellationToken)
        {
            await _service.AssignMenusAsync(roleId, menuIds, cancellationToken);
            return Ok("Permissions Updated Successfully");
        }

        [HttpGet("role/{roleId}")]
        public async Task<IActionResult> GetMenusByRole(int roleId, CancellationToken cancellationToken)
        {
            var result = await _service.GetMenusByRoleAsync(roleId, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveMenu(int roleId, int menuId, CancellationToken cancellationToken)
        {
            await _service.RemoveMenuAsync(roleId, menuId, cancellationToken);
            return Ok("Permission Removed");
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _service.GetAllAsync(cancellationToken);
            return Ok(result);
        }
    }
}
