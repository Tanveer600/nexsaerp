using ERPSoftifyApplicatione.ApplicationLayer.DTO.PermissionsDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTOs;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionService _service;

        public PermissionController(IPermissionService service)
        {
            _service = service;
        }

        // Create Permission
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreatePermissionDto dto, CancellationToken cancellationToken)
        {
            var result = await _service.CreatePermissionAsync(dto, cancellationToken);
            return Ok(result);
        }

        // Get all permissions
        [HttpGet("getpermission")]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _service.GetAllPermissionsAsync(cancellationToken);
            return Ok(result);
        }

        // Get by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var result = await _service.GetPermissionByIdAsync(id, cancellationToken);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePermissionDto dto, CancellationToken cancellationToken)
        {
            var result = await _service.UpdatePermissionAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var result = await _service.DeletePermissionAsync(id, cancellationToken);
            return Ok(result);
        }
    }
}