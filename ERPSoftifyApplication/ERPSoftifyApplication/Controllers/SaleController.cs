using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.Quotation;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.SalesOutput;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private readonly ISaleService _service;

        public SaleController(ISaleService service)
        {
            _service = service;
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSaleRequest request, CancellationToken cancellationToken)
        {
            if (request == null) return BadRequest("Invalid request data");

            var response = await _service.CreateSaleAsync(request, cancellationToken);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }
        [HttpGet("saletList")]
        public async Task<IActionResult> GetSaleList(CancellationToken cancellationToken = default)
        {
            var result = await _service.GetAllSaleListAsync(cancellationToken);
            return Ok(result);
        }
        [HttpPost("convert-to-sale/{quotationId}")]
        public async Task<IActionResult> ConvertQuotationToSale(int quotationId, CancellationToken cancellationToken)
        {
            var response = await _service.ConvertQuotationToSaleAsync(quotationId, cancellationToken);

            if (response.Success) 
                return Ok(response);

            return BadRequest(response);
        }
            [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var response = await _service.GetAllSalesAsync(pageNumber, pageSize, cancellationToken);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
         
            
            
            
            
            
            
            var response = await _service.GetSaleByIdAsync(id, cancellationToken);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateSaleRequest request, CancellationToken cancellationToken)
        {
            if (id != request.QuotationId) return BadRequest("ID mismatch in URL and body");

            var response = await _service.UpdateSaleAsync(request, cancellationToken);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var response = await _service.DeleteSaleAsync(id, cancellationToken);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }
    }
}
