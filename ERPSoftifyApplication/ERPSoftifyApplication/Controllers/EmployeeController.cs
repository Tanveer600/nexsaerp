using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.EmployeeDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _Service;
        

        public EmployeeController(IEmployeeService Service)
        {
            _Service = Service;
         
        }
         [Authorize]
        [HttpPost("createEmployee")]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto, CancellationToken cancellationToken)
        {
            try
            {
               
                var result = await _Service.CreateEmployeeAsync(dto, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.ToString());
            }

        }
        [HttpGet("getEmployee")]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var result = await _Service.GetAllEmployeeAsync(pageNumber, pageSize, cancellationToken);
            return Ok(result);
        }

        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.GetEmployeeByIdAsync(id, cancellationToken);
            return Ok(result);
        }
        [HttpPut("updateEmployee/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto dto, CancellationToken cancellationToken)
        {
            var result = await _Service.UpdateEmployeeAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("deleteEmployee/{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.DeleteEmployeeAsync(id, cancellationToken);
            return Ok(result);
        }
    }
}
