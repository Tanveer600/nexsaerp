using ERPSoftifyApplicatione.ApplicationLayer.DTO.Quotation;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.VendorQuotatinOutput;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendorQuotationController : ControllerBase
    {
        private readonly IVendorQuotationService _service;

        public VendorQuotationController(IVendorQuotationService service)
        {
            _service = service;
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateVendorQuotationRequest request, CancellationToken cancellationToken)
        {
            if (request == null) return BadRequest("Invalid request data");

            var response = await _service.CreateVendorQuotationAsync(request, cancellationToken);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var response = await _service.GetAllVendorQuotationsAsync(pageNumber, pageSize, cancellationToken);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var response = await _service.GetVendorQuotationByIdAsync(id, cancellationToken);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateVendorQuotationRequest request, CancellationToken cancellationToken)
        {
            if (id != request.VendorQuotationId) return BadRequest("ID mismatch in URL and body");

            var response = await _service.UpdateVendorQuotationAsync(request, cancellationToken);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var response = await _service.DeleteVendorQuotationAsync(id, cancellationToken);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }
    }
}
