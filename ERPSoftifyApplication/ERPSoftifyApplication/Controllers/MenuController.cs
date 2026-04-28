using ERPSoftifyApplicatione.ApplicationLayer.DTO.MenuDtos;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _menuService;

        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create(CreateMenuDto dto, CancellationToken ct)
        {
            var result = await _menuService.CreateMenuAsync(dto, ct);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll(CancellationToken ct)
        {
            var result = await _menuService.GetAllMenusAsync(ct);
            return Ok(result);
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
        {
            var result = await _menuService.GetMenuByIdAsync(id, ct);
            return result.Success ? Ok(result) : NotFound(result);
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateMenuDto dto, CancellationToken ct)
        {
            var result = await _menuService.UpdateMenuAsync(dto, ct);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            var result = await _menuService.DeleteMenuAsync(id, ct);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpGet("GetMenusByRole/{roleId}")]
        public async Task<IActionResult> GetMenusByRole(int roleId, CancellationToken ct)
        {
            var result = await _menuService.GetMenusByRoleAsync(roleId, ct);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}