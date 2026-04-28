using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrderController : ControllerBase
    {
        private readonly IPurchaseOrderService _Service;

        public PurchaseOrderController(IPurchaseOrderService Service)
        {
            _Service = Service;
        }

        [HttpPost("createpurchaseorder")]
        public async Task<IActionResult> Create([FromBody] PurchaseOrder Role, CancellationToken cancellationToken)
        {
            var result = await _Service.CreatePurchaseOrderAsync(Role, cancellationToken);
            return Ok(result);
        }

        [HttpGet("getpurchaseorder")]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _Service.GetAllPurchaseOrdersAsync(cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.GetPurchaseOrderByIdAsync(id, cancellationToken);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PurchaseOrder Role, CancellationToken cancellationToken)
        {
            var result = await _Service.UpdatePurchaseOrderAsync(id, Role, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var result = await _Service.DeletePurchaseOrderAsync(id, cancellationToken);
            return Ok(result);
        }
    }
}
