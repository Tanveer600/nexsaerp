using ERPSoftifyApplicatione.ApplicationLayer.DTO;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TenantController : ControllerBase
    {
        private readonly ITenantService _service;

        public TenantController(ITenantService service)
        {
            _service = service;
        }

        [HttpPost("createTenantSetting")]
        public async Task<IActionResult> Create( [FromBody] CreateTenantDto dto, CancellationToken cancellationToken)
        {
            var result = await _service.CreateTenantSettingAsync(dto, cancellationToken);
            return Ok(result);
        }

        [HttpGet("getTenantSetting")]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _service.GetAllTenantSettingsAsync(cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var result = await _service.GetTenantSettingByIdAsync(id, cancellationToken);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] CreateTenantDto dto,
            CancellationToken cancellationToken)
        {
            var result = await _service.UpdateTenantSettingAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var result = await _service.DeleteTenantSettingAsync(id, cancellationToken);
            return Ok(result);
        }
    }
}