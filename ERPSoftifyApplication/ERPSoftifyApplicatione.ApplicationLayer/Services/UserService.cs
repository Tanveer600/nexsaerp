using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.User;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class UserService : IUserService
    {
        private readonly IUserInterface _UserRepository;
        private readonly ITenantInterface _tenantsRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IBranchInterface _branchRepository;
        private readonly ICompanySettingInterface _companyRepository;
        private readonly string _jwtSecret;

        public UserService(IUserInterface userRepository, IConfiguration configuration, ITenantInterface tenantInterface, IBranchInterface branchInterface, ICompanySettingInterface companyRepository, ICurrentUserService currentUserService)
        {
            _UserRepository = userRepository;
            _tenantsRepository = tenantInterface;
            _branchRepository = branchInterface;
            _jwtSecret = configuration["Jwt:Key"] ?? "DefaultSuperSecretKey123";
            _companyRepository = companyRepository;
            _currentUserService = currentUserService;
        }

        #region Create User
        public async Task<ResponseDataModel<UserDto>> CreateUserAsync(CreateUserDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var user = new User
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    RoleId = dto.RoleId,
                    TenantId = dto.TenantId,
                    BranchId = dto.BranchId,
                    CompanyId = dto.CompanyId,                 
                    PhoneNumber = dto.PhoneNumber,
                    WebsiteUrl = dto.WebsiteUrl,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    IsActive = dto.IsActive ?? false,
                    Status = dto.Status,
                    UpdatedAt = DateTime.UtcNow,
                    EmployeeId = 1
                };

                var result = await _UserRepository.CreateAsync(user, cancellationToken);

                var userDto = new UserDto
                {
                    Id = result.ID,
                    Name = result.Name,
                    UserName = result.Name,
                    Email = result.Email,
                    Password = result.PasswordHash,
                    RoleId = result.RoleId,
                    TenantId = result.TenantId,
                    BranchId = result.BranchId,
                    CompanyId = result.CompanyId,
                    EmployeeId = result.EmployeeId,
                    PhoneNumber = result.PhoneNumber,
                    WebsiteUrl = result.WebsiteUrl,
                    IsActive = dto.IsActive ?? false,
                    Status = result.Status
                };

                return ResponseDataModel<UserDto>.SuccessResponse(userDto, "User created successfully");
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
        }
        #endregion

        #region Get User
        public async Task<ResponseDataModel<UserDto>> GetUserByIdAsync(int id, CancellationToken cancellationToken)
        {
            var user = await _UserRepository.GetByIdAsync(id, cancellationToken);

            if (user == null)
                return ResponseDataModel<UserDto>.FailureResponse("User not found");

            var dto = new UserDto
            {
                Id = user.ID,
                Name = user.Name,
                UserName = user.Name,
                Email = user.Email,
                RoleId = user.RoleId,
                TenantId = user.TenantId,
                BranchId = user.BranchId,
                CompanyId = user.CompanyId,
                EmployeeId = user.EmployeeId,
                PhoneNumber = user.PhoneNumber,
                WebsiteUrl = user.WebsiteUrl,
                IsActive = user.IsActive,
                Status = user.Status,
                Password = user.PasswordHash
            };

            return ResponseDataModel<UserDto>.SuccessResponse(dto);
        }
        #endregion

        #region Update User
        public async Task<ResponseDataModel<UserDto>> UpdateUserAsync(int id, UpdateUserDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var user = await _UserRepository.GetByIdAsync(id, cancellationToken);
                if (user == null)
                    return ResponseDataModel<UserDto>.FailureResponse("User not found");

                // Validate foreign keys
                if (!await _UserRepository.CompanyExistsAsync(dto.CompanyId, cancellationToken))
                    return ResponseDataModel<UserDto>.FailureResponse("Company not found");

                if (!await _UserRepository.BranchExistsAsync(dto.BranchId, cancellationToken))
                    return ResponseDataModel<UserDto>.FailureResponse("Branch not found");

                // Update fields
                user.Name = dto.Name;
                user.Email = dto.Email;
                user.RoleId = dto.RoleId;
                user.TenantId = dto.TenantId;
                user.BranchId = dto.BranchId;
                user.CompanyId = dto.CompanyId;
                user.EmployeeId = 1;
                user.PhoneNumber = dto.PhoneNumber;
                user.Status = dto.Status;


                if (!string.IsNullOrEmpty(dto.Password))
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

                user.UpdatedAt = DateTime.UtcNow;

                var updated = await _UserRepository.UpdateAsync(user, cancellationToken);

                // ... updated variable ke baad
                var dtoResult = new UserDto
                {
                    Id = updated.ID,
                    Name = updated.Name,
                    UserName = updated.Name,
                    Email = updated.Email,
                    RoleId = updated.RoleId,
                    TenantId = updated.TenantId,   // <-- Ye ADD karein
                    BranchId = updated.BranchId,   // <-- Ye ADD karein
                    CompanyId = updated.CompanyId, // <-- Ye ADD karein
                    EmployeeId = 1,
                    PhoneNumber = updated.PhoneNumber,
                    WebsiteUrl = updated.WebsiteUrl,
                    IsActive = updated.IsActive,
                    Status = updated.Status,
                    Password = updated.PasswordHash
                };

                return ResponseDataModel<UserDto>.SuccessResponse(dtoResult, "User updated successfully");
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        #endregion

        #region Delete User
        public async Task<ResponseDataModel<bool>> DeleteUserAsync(int id, CancellationToken cancellationToken)
        {
            var exists = await _UserRepository.GetByIdAsync(id, cancellationToken);
            if (exists == null)
                return ResponseDataModel<bool>.FailureResponse("User not found");

            var deleted = await _UserRepository.DeleteAsync(id, cancellationToken);
            return ResponseDataModel<bool>.SuccessResponse(deleted, "User deleted successfully");
        }
        #endregion
        public async Task<ResponseDataModel<bool>> SignupAsync(SignupDto dto, CancellationToken cancellationToken)
        {
            var existingUser = await _UserRepository.GetByEmailAsync(dto.Email,dto.TenantId, cancellationToken);
            if (existingUser != null)
                return ResponseDataModel<bool>.FailureResponse("Email already registered");

            var tenant = new TenantSetting
            {
                Name = dto.CompanyName,
                CreatedAt = DateTime.UtcNow
            };

            await _tenantsRepository.CreateAsync(tenant, cancellationToken);

            var branch = new Branch
            {
                Name = $"{dto.CompanyName} Head Office", // optional, unique branch name
                TenantId = tenant.ID,
                CreatedAt = DateTime.UtcNow
            };

            var user = new User
            {
                Name = dto.OwnerName,   
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                TenantId = tenant.ID,
                BranchId = branch.Id,
                RoleId = 1,
                Status = "Active",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var company = new CompanySetting
            {
                CompanyName = dto.CompanyName,  // display name
                ///Address = dto.CompanyAddress,
                TenantId = tenant.ID,
                Phone = dto.PhoneNumber
            };

            return ResponseDataModel<bool>.SuccessResponse(true, "Signup successful");
        }
        #region Login
        public async Task<ResponseDataModel<LoginResponseDto>> LoginAsync(LoginDto dto, CancellationToken cancellationToken)
        {
            try
            {
                var matchedUser = await _UserRepository.GetByLoginAsync(dto.Email, dto.TenantId, cancellationToken);

                if (matchedUser == null)
                    return ResponseDataModel<LoginResponseDto>.FailureResponse("Invalid credentials");

                if (string.IsNullOrEmpty(matchedUser.PasswordHash))
                    return ResponseDataModel<LoginResponseDto>.FailureResponse("Password not set");

                if (!BCrypt.Net.BCrypt.Verify(dto.Password, matchedUser.PasswordHash))
                    return ResponseDataModel<LoginResponseDto>.FailureResponse("Invalid credentials");

                if (!matchedUser.IsActive)
                    return ResponseDataModel<LoginResponseDto>.FailureResponse("User inactive");

                var token = GenerateJwtToken(matchedUser);

                var response = new LoginResponseDto
                {
                    UserId = matchedUser.ID,
                    Name = matchedUser.Name,
                    RoleId = matchedUser.RoleId,
                    Token = token,
                    TenantId = matchedUser.TenantId,
                    CompanyId = matchedUser.CompanyId,
                    Branchd=matchedUser.BranchId,
                };

                return ResponseDataModel<LoginResponseDto>.SuccessResponse(response, "Login successful");
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Role, user.RoleId.ToString()),
        new Claim("TenantId", user.TenantId.ToString()),
        new Claim("BranchId", user.BranchId.ToString())  
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(5),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        #endregion

        #region Password Management
        public async Task<ResponseDataModel<bool>> ChangePasswordAsync(ChangePasswordDto dto, CancellationToken cancellationToken)
        {
            var user = await _UserRepository.GetByIdAsync(dto.UserId, cancellationToken);
            if (user == null)
                return ResponseDataModel<bool>.FailureResponse("User not found");

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                return ResponseDataModel<bool>.FailureResponse("Current password incorrect");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _UserRepository.UpdateAsync(user, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(true, "Password changed successfully");
        }

        public async Task<ResponseDataModel<bool>> ForgotPasswordAsync(ForgotPasswordDto dto, CancellationToken cancellationToken)
        {
            var user = await _UserRepository.GetByEmailAsync(dto.Email,dto.TenantId, cancellationToken);
            if (user == null)
                return ResponseDataModel<bool>.FailureResponse("Email not found");

            var token = Guid.NewGuid().ToString();
            user.ResetToken = token;
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(30);
            await _UserRepository.UpdateAsync(user, cancellationToken);

            // TODO: Send email with token
            return ResponseDataModel<bool>.SuccessResponse(true, "Reset link sent to email");
        }

        public async Task<ResponseDataModel<bool>> ResetPasswordAsync(ResetPasswordDto dto, CancellationToken cancellationToken)
        {
            var user = await _UserRepository.GetByEmailAsync(dto.Email,dto.TenantId, cancellationToken);
            if (user == null || user.ResetToken != dto.Token || user.ResetTokenExpiry < DateTime.UtcNow)
                return ResponseDataModel<bool>.FailureResponse("Invalid or expired token");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpiry = null;

            await _UserRepository.UpdateAsync(user, cancellationToken);
            return ResponseDataModel<bool>.SuccessResponse(true, "Password reset successful");
        }
        #endregion

        #region Update Email
        public async Task<ResponseDataModel<bool>> UpdateEmailAsync(UpdateEmailDto dto, CancellationToken cancellationToken)
        {
            var user = await _UserRepository.GetByIdAsync(dto.UserId, cancellationToken);
            if (user == null)
                return ResponseDataModel<bool>.FailureResponse("User not found");

            user.Email = dto.NewEmail;
            await _UserRepository.UpdateAsync(user, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(true, "Email updated successfully");
        }
        #endregion

        #region Get All Users
        public async Task<ResponseDataModel<List<UserDto>>> GetAllUsersAsync(CancellationToken cancellationToken)
        {
            
            var users = await _UserRepository.GetAllAsync(cancellationToken);
            var filteredUsers = users.ToList();

            if (!filteredUsers.Any())
                return ResponseDataModel<List<UserDto>>.SuccessResponse(new List<UserDto>());

            var dtoList = filteredUsers.Select(u => new UserDto
            {
                Id = u.ID,
                Name = u.Name,
                UserName = u.Name,
                Email = u.Email,
                RoleId = u.RoleId,
                TenantId = u.TenantId,
                BranchId = u.BranchId,
                CompanyId = u.CompanyId,
                // ?. use karein taake null hone par crash na ho
                TenantName = u.Tenant?.Name ?? "N/A",
                BranchName = u.Branch?.Name ?? "N/A",
                RoleName = u.Role?.RoleName ?? "N/A",
                CompanyName = u.Company?.CompanyName ?? "N/A",
                PhoneNumber = u.PhoneNumber,
                Status = u.Status
            }).ToList();

            return ResponseDataModel<List<UserDto>>.SuccessResponse(dtoList);
        }
        #endregion

        #region Activate User (Not Implemented)
        public Task<ResponseDataModel<bool>> ActivateUserAsync(int userId, bool isActive, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        #region Foreign Key Checks
        public async Task<ResponseDataModel<bool>> CompanyExistsAsync(int companyId, CancellationToken cancellationToken)
        {
            var exists = await _UserRepository.GetAllAsync(cancellationToken);
            var companyExists = exists.Any(u => u.CompanyId == companyId); // check in users for simplicity
            return ResponseDataModel<bool>.SuccessResponse(companyExists, companyExists ? "Company exists" : "Company not found");
        }

        public async Task<ResponseDataModel<bool>> BranchExistsAsync(int branchId, CancellationToken cancellationToken)
        {
            var exists = await _UserRepository.GetAllAsync(cancellationToken);
            var branchExists = exists.Any(u => u.BranchId == branchId); // check in users for simplicity
            return ResponseDataModel<bool>.SuccessResponse(branchExists, branchExists ? "Branch exists" : "Branch not found");
        }
        #endregion
        #endregion
    }
}