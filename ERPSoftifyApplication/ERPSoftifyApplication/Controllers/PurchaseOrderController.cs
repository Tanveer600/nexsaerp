using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.PurchaseDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrderController : ControllerBase
    {
        private readonly IPurchaseOrderService _service;

        public PurchaseOrderController(IPurchaseOrderService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PurchaseOrderRequestDto request, CancellationToken cancellationToken)
        {
            if (request == null) return BadRequest("Invalid request data");

            var response = await _service.CreatePurchaseOrderAsync(request, cancellationToken);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }
        [HttpPost("convert-to-purchase/{vendorQuotationId}")]
        public async Task<IActionResult> ConvertVendorQuotationToPurchase(int vendorQuotationId, CancellationToken cancellationToken)
        {
            var response = await _service.ConvertQuotationToPurchaseAsync(vendorQuotationId, cancellationToken);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var response = await _service.GetAllPurchaseOrdersAsync(pageNumber, pageSize, cancellationToken);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var response = await _service.GetPurchaseOrderByIdAsync(id, cancellationToken);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PurchaseOrderRequestDto request, CancellationToken cancellationToken)
        {
            if (id != request.ID) return BadRequest("ID mismatch in URL and body");

            var response = await _service.UpdatePurchaseOrderAsync(request, cancellationToken);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var response = await _service.DeletePurchaseOrderAsync(id, cancellationToken);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }
    }
}
