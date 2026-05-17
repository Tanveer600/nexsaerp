using ERPSoftifyApplicatione.ApplicationLayer.DTO.InvoiceDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _Service;

        public InvoiceController(IInvoiceService Service)
        {
            _Service = Service;
        }

        [HttpPost("createInvoice")]
        public async Task<IActionResult> Create([FromBody] CreateInvoiceOutPutDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _Service.CreateInvoiceAsync(dto, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.ToString());
            }

        }
        [HttpGet("getInvoice")]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var result = await _Service.GetAllInvoicesAsync(pageNumber, pageSize, cancellationToken);
            return Ok(result);
        }
        [HttpGet("invoiceList")]
        public async Task<IActionResult> GetInvoiceList(CancellationToken cancellationToken = default)
        {
            var result = await _Service.GetInvoiceListAsync(cancellationToken);
            return Ok(result);
        }
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.GetInvoiceByIdAsync(id, cancellationToken);
            return Ok(result);
        }
        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] InvoiceOutPutDto dto, CancellationToken cancellationToken)
        {
            var result = await _Service.UpdateInvoiceAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("deleteInvoice/{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.DeleteInvoiceAsync(id, cancellationToken);
            return Ok(result);
        }
    }
}
