using ERPSoftifyApplicatione.ApplicationLayer.DTO.PurchaseDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.QuotationOutput;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuotationController : ControllerBase
    {
        private readonly IQuotationService _service;

        public QuotationController(IQuotationService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] QuotationRequestDto request, CancellationToken cancellationToken)
        {
            if (request == null) return BadRequest("Invalid request data");

            var response = await _service.CreateQuotationAsync(request, cancellationToken);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var response = await _service.GetAllQuotationsAsync(pageNumber, pageSize, cancellationToken);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var response = await _service.GetQuotationByIdAsync(id, cancellationToken);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] QuotationRequestDto request, CancellationToken cancellationToken)
        {
            if (id != request.ID) return BadRequest("ID mismatch in URL and body");

            var response = await _service.UpdateQuotationAsync(request, cancellationToken);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var response = await _service.DeleteQuotationAsync(id, cancellationToken);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }
    }
}
