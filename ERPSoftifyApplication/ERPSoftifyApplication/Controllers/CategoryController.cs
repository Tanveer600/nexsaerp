using ERPSoftifyApplicatione.ApplicationLayer.DTO.CategoryDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _Service;
        public CategoryController(ICategoryService Service)
        {
            _Service = Service;
        }


       
        [HttpPost("createCategory")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _Service.CreateCategoryAsync(dto, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.ToString());
            }

        }
        [HttpGet("getCategory")]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var result = await _Service.GetAllCategoryAsync(pageNumber, pageSize, cancellationToken);
            return Ok(result);
        }
        [HttpGet("categoryList")]
        public async Task<IActionResult> GetCategoryList(CancellationToken cancellationToken = default)
        {
            var result = await _Service.GetAllCategoryListAsync(cancellationToken);
            return Ok(result);
        }
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.GetCategoryByIdAsync(id, cancellationToken);
            return Ok(result);
        }
        [HttpPut("updateCategory/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto, CancellationToken cancellationToken)
        {
            var result = await _Service.UpdateCategoryAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("deleteCategory/{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.DeleteCategoryAsync(id, cancellationToken);
            return Ok(result);
        }
    }
}
