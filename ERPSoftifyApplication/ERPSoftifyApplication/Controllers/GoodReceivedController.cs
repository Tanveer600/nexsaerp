using ERPSoftifyApplicatione.ApplicationLayer.DTO.DeliveryNoteDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.GoodReceived;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoodReceivedController : ControllerBase
    {
        private readonly IGoodReceivedService _goodReceivedService;

        public GoodReceivedController(IGoodReceivedService goodReceivedService)
        {
            _goodReceivedService = goodReceivedService;
        }
        [Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateGoodReceived([FromBody] GoodReceivedRequestDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _goodReceivedService.CreateGoodReceived(dto, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.ToString());
            }

        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var result = await _goodReceivedService.GetAllGoodReceiveds(pageNumber, pageSize, cancellationToken);
            return Ok(result);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<GoodReceivedRequestDto>> GetGoodReceivedById(int id, CancellationToken ct)
        {
            var result = await _goodReceivedService.GetGoodReceivedById(id, ct);
            if (result == null) return NotFound($"Transaction with ID {id} not found.");

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGoodReceived(int id, CancellationToken ct)
        {
            var result = await _goodReceivedService.DeleteGoodReceived(id, ct);
            if (result)
            {
                return Ok(new { message = "Transaction deleted successfully." });
            }
            return BadRequest("Failed to delete transaction.");
        }
    }
}
