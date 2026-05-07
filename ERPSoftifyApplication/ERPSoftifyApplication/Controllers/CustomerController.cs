using ERPSoftifyApplicatione.ApplicationLayer.DTO;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.CustomerDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _Service;

        public CustomerController(ICustomerService Service)
        {
            _Service = Service;
        }

      
        [Authorize]
        [HttpPost("createCustomer")]
        public async Task<IActionResult> Create([FromBody] CreateCustomerDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _Service.CreatecustomerAsync(dto, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.ToString());
            }

        }
        [HttpGet("getCustomer")]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var result = await _Service.GetAllcustomerAsync(pageNumber, pageSize, cancellationToken);
            return Ok(result);
        }
        [HttpGet("customerList")]
        public async Task<IActionResult> GetCustomerList(CancellationToken cancellationToken = default)
        {
            var result = await _Service.GetAllCustomerListAsync(cancellationToken);
            return Ok(result);
        }
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.GetcustomerByIdAsync(id, cancellationToken);
            return Ok(result);
        }
        [HttpPut("updateCustomer/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCustomerDto dto, CancellationToken cancellationToken)
        {
            var result = await _Service.UpdatecustomerAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("deleteCustomer/{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.DeletecustomerAsync(id, cancellationToken);
            return Ok(result);
        }
    }
}