using ERPSoftifyApplicatione.ApplicationLayer.DTO.VendorDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendorController : ControllerBase
    {
        private readonly IVendorService _Service;

        public VendorController(IVendorService Service)
        {
            _Service = Service;
        }


        [Authorize]
        [HttpPost("createVendor")]
        public async Task<IActionResult> Create([FromBody] CreateVendorDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _Service.CreateVendorAsync(dto, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.ToString());
            }

        }
        [HttpGet("getVendor")]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var result = await _Service.GetAllVendorAsync(pageNumber, pageSize, cancellationToken);
            return Ok(result);
        }
        [HttpGet("getVendorList")]
        public async Task<IActionResult> GetAllList( CancellationToken cancellationToken = default)
        {
            var result = await _Service.GetAllVendorListAsync( cancellationToken);
            return Ok(result);
        }
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.GetVendorByIdAsync(id, cancellationToken);
            return Ok(result);
        }
        [HttpPut("updateVendor/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateVendorDto dto, CancellationToken cancellationToken)
        {
            var result = await _Service.UpdateVendorAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("deleteVendor/{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.DeleteVendorAsync(id, cancellationToken);
            return Ok(result);
        }

    }
}
