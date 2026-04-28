using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _Service;

        public RoleController(IRoleService Service)
        {
            _Service = Service;
        }

        [HttpPost("createrole")]
        public async Task<IActionResult> Create([FromBody] Role Role, CancellationToken cancellationToken)
        {
            var result = await _Service.CreateRoleAsync(Role, cancellationToken);
            return Ok(result);
        }

        [HttpGet("getrole")]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _Service.GetAllRolesAsync(cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.GetRoleByIdAsync(id, cancellationToken);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Role Role, CancellationToken cancellationToken)
        {
            var result = await _Service.UpdateRoleAsync(id, Role, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.DeleteRoleAsync(id, cancellationToken);
            return Ok(result);
        }
    }
}
