using ERPSoftifyApplicatione.ApplicationLayer.DTO;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ICurrentUserService _currentUserService;

        public EmailController(IEmailService emailService, ICurrentUserService currentUserService)
        {
            _emailService = emailService;
            _currentUserService = currentUserService;
        }

        [HttpPost]
        public async Task<IActionResult> SendEmail([FromBody] SendEmailDto dto)
        {
            try
            {
                await _emailService.SendEmailAsync(dto.To, dto.Subject, dto.Body);
                return Ok(new { message = "Email sent successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("inbox")]
        public async Task<IActionResult> SyncInbox([FromBody] SyncInboxDto dto)
        {
            try
            {
                int tenantId = _currentUserService.TenantId;

                await _emailService.SyncInboxAsync(dto.Email, tenantId);
                return Ok(new { message = "Inbox synced successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetInbox()
        {
            try
            {
                int tenantId = _currentUserService.TenantId;

                var emails = await _emailService.GetInboxAsync(tenantId);
                return Ok(emails);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
