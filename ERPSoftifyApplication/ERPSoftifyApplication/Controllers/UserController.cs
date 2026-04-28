using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.User;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ERPSoftifyApplicatione.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken ct)
        {
            try
            {
                var result = await _userService.LoginAsync(dto, ct);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString()); 
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateUserDto dto, CancellationToken ct)
        {
            var result = await _userService.CreateUserAsync(dto, ct);
            return Ok(result);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll([FromBody] CancellationToken cancellationToken = default)
        {
            var result = await _userService.GetAllUsersAsync( cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
        {
            var result = await _userService.GetUserByIdAsync(id, ct);
            return Ok(result);
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto, CancellationToken ct)
        {
            var result = await _userService.UpdateUserAsync(id, dto, ct);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            var result = await _userService.DeleteUserAsync(id, ct);
            return Ok(result);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupDto dto, CancellationToken ct)
        {
            var result = await _userService.SignupAsync(dto, ct);
            return Ok(result);
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto, CancellationToken ct)
        {
            var result = await _userService.ChangePasswordAsync(dto, ct);
            return Ok(result);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto, CancellationToken ct)
        {
            var result = await _userService.ForgotPasswordAsync(dto, ct);
            return Ok(result);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto, CancellationToken ct)
        {
            var result = await _userService.ResetPasswordAsync(dto, ct);
            return Ok(result);
        }
        
        [HttpPost("update-email")]
        public async Task<IActionResult> UpdateEmail([FromBody] UpdateEmailDto dto, CancellationToken ct)
        {
            var result = await _userService.UpdateEmailAsync(dto, ct);
            return Ok(result);
        }

        [HttpPost("{id:int}/activate")]
        public async Task<IActionResult> ActivateUser(int id, [FromQuery] bool isActive, CancellationToken ct)
        {
            var result = await _userService.ActivateUserAsync(id, isActive, ct);
            return Ok(result);
        }

        [HttpGet("company-exists/{companyId:int}")]       
        public async Task<IActionResult> CompanyExists(int companyId, CancellationToken ct)
        {
            var result = await _userService.CompanyExistsAsync(companyId, ct);
            return Ok(result);
        }

        [HttpGet("branch-exists/{branchId:int}")]
        public async Task<IActionResult> BranchExists(int branchId, CancellationToken ct)
        {
            var result = await _userService.BranchExistsAsync(branchId, ct);
            return Ok(result);
        }
    }
}