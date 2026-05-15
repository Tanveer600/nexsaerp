using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.DeliveryNoteDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeliveryNoteController : ControllerBase
    {
        private readonly IDeliveryNoteService _deliveryNoteService;

        public DeliveryNoteController(IDeliveryNoteService deliveryNoteService)
        {
            _deliveryNoteService = deliveryNoteService;
        }
        //[Authorize]
        [HttpPost("create")]
        public async Task<IActionResult> CreateDeliveryNote([FromBody] DeliveryNoteRequestDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _deliveryNoteService.CreateDeliveryNote(dto, cancellationToken);
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
            var result = await _deliveryNoteService.GetAllDeliveryNotes(pageNumber, pageSize, cancellationToken);
            return Ok(result);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<DeliveryNoteRequestDto>> GetDeliveryNoteById(int id, CancellationToken ct)
        {
            var result = await _deliveryNoteService.GetDeliveryNoteById(id, ct);
            if (result == null) return NotFound($"Transaction with ID {id} not found.");

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeliveryNote(int id, CancellationToken ct)
        {
            var result = await _deliveryNoteService.DeleteDeliveryNote(id, ct);
            if (result)
            {
                return Ok(new { message = "Transaction deleted successfully." });
            }
            return BadRequest("Failed to delete transaction.");
        }
    }
}