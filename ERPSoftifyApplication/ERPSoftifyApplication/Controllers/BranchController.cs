using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BranchController : ControllerBase
    {
        private readonly IBranchService _Service;

        public BranchController(IBranchService Service)
        {
            _Service = Service;
        }
        [Authorize]
        [HttpPost("createBranch")]
        public async Task<IActionResult> Create([FromBody] BranchDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _Service.CreateBranchAsync(dto, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {

                return StatusCode(500, ex.ToString());
            }
          
        }

        [HttpGet("getBranch")]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _Service.GetAllBranchsAsync(cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.GetBranchByIdAsync(id, cancellationToken);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BranchDto dto, CancellationToken cancellationToken)
        {
            var result = await _Service.UpdateBranchAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.DeleteBranchAsync(id, cancellationToken);
            return Ok(result);
        }
    }
    }
