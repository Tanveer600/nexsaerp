using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _Service;

        public ProductController(IProductService Service)
        {
            _Service = Service;
        }


        [Authorize]
        [HttpPost("createProduct")]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _Service.CreateProductAsync(dto, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.ToString());
            }

        }
        [HttpGet("getProduct")]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var result = await _Service.GetAllProductAsync(pageNumber, pageSize, cancellationToken);
            return Ok(result);
        }
        [HttpGet("productList")]
        public async Task<IActionResult> GetProductList( CancellationToken cancellationToken = default)
        {
            var result = await _Service.GetAllProductListAsync( cancellationToken);
            return Ok(result);
        }
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.GetProductByIdAsync(id, cancellationToken);
            return Ok(result);
        }
        [HttpPut("updateProduct/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto, CancellationToken cancellationToken)
        {
            var result = await _Service.UpdateProductAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("deleteProduct/{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.DeleteProductAsync(id, cancellationToken);
            return Ok(result);
        }
    }
}
