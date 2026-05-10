using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.StockTransactionDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockTransactionController : ControllerBase
    {
        private readonly IStockTransactionService _service; 
        public StockTransactionController(IStockTransactionService service) => _service = service;

        [HttpGet("all")]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var result = await _service.GetAllTransactionsAsync(pageNumber, pageSize, cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
            => Ok(await _service.GetTransactionById(id, ct));

        [HttpPost("create")]
        public async Task<IActionResult> CreateTransaction([FromBody] StockTransactionDto model, CancellationToken ct)
            => Ok(await _service.CreateTransaction(model, ct));

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, [FromBody] UpdateStockTransactionDto dto, CancellationToken cancellationToken)
        {
            var result = await _service.UpdateTransaction(id, dto, cancellationToken);
            return Ok(result);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id, CancellationToken ct)
            => Ok(await _service.DeleteTransaction(id, ct));
    }
}
