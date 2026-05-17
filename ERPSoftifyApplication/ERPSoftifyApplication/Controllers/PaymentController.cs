using ERPSoftifyApplicatione.ApplicationLayer.DTO.PaymentDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _Service;

        public PaymentController(IPaymentService Service)
        {
            _Service = Service;
        }


        //[Authorize]
        [HttpPost("createPayment")]
        public async Task<IActionResult> Create([FromBody] CreatePaymentDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _Service.CreatePaymentAsync(dto, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.ToString());
            }

        }
        [HttpGet("getPayment")]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var result = await _Service.GetAllPaymentAsync(pageNumber, pageSize, cancellationToken);
            return Ok(result);
        }
        [HttpGet("paymentList")]
        public async Task<IActionResult> GetPaymentList(CancellationToken cancellationToken = default)
        {
            var result = await _Service.GetAllPaymentListAsync(cancellationToken);
            return Ok(result);
        }
        [HttpGet("getById/{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.GetPaymentByIdAsync(id, cancellationToken);
            return Ok(result);
        }
        [HttpPut("updatePayment/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePaymentDto dto, CancellationToken cancellationToken)
        {
            var result = await _Service.UpdatePaymentAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("deletePayment/{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.DeletePaymentAsync(id, cancellationToken);
            return Ok(result);
        }
    }
}
