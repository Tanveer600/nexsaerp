using ERPSoftifyApplicatione.ApplicationLayer.DTO.WarehouseDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehouseController : ControllerBase
    {            
            private readonly IWareHouseService _Service;

            public WarehouseController(IWareHouseService Service)
            {
                _Service = Service;
            }


            [Authorize]
            [HttpPost("createWarehouse")]
            public async Task<IActionResult> Create([FromBody] WarehouseCreateDto dto, CancellationToken cancellationToken)
            {
                try
                {
                    var result = await _Service.CreateWarehouseAsync(dto, cancellationToken);
                    return Ok(result);
                }
                catch (Exception ex)
                {

                    return StatusCode(500, ex.ToString());
                }

            }
            [HttpGet("getWarehouse")]
            public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
            {
                var result = await _Service.GetAllWarehouseAsync(pageNumber, pageSize, cancellationToken);
                return Ok(result);
            }
            [HttpGet("WarehouseList")]
            public async Task<IActionResult> GetWarehouseList(CancellationToken cancellationToken = default)
            {
                var result = await _Service.GetAllWarehouseListAsync(cancellationToken);
                return Ok(result);
            }
            [HttpGet("getById/{id}")]
            public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
            {
                var result = await _Service.GetWarehouseByIdAsync(id, cancellationToken);
                return Ok(result);
            }
            [HttpPut("updateWarehouse/{id}")]
            public async Task<IActionResult> Update(int id, [FromBody] WarehouseUpdateDto dto, CancellationToken cancellationToken)
            {
                var result = await _Service.UpdateWarehouseAsync(id, dto, cancellationToken);
                return Ok(result);
            }

            [HttpDelete("deleteWarehouse/{id}")]
            public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
            {
                var result = await _Service.DeleteWarehouseAsync(id, cancellationToken);
                return Ok(result);
            }
        }
    }
