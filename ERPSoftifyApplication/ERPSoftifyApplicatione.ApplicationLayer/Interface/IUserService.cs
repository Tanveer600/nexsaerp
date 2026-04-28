using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IUserService
    {
        Task<ResponseDataModel<UserDto>> CreateUserAsync( CreateUserDto dto, CancellationToken cancellationToken);

        Task<ResponseDataModel<List<UserDto>>> GetAllUsersAsync(CancellationToken cancellationToken);

        Task<ResponseDataModel<UserDto>> GetUserByIdAsync( int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<UserDto>> UpdateUserAsync( int id, UpdateUserDto dto, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeleteUserAsync( int id, CancellationToken cancellationToken);
        Task<ResponseDataModel<bool>> SignupAsync(SignupDto dto, CancellationToken cancellationToken);

        Task<ResponseDataModel<LoginResponseDto>> LoginAsync( LoginDto dto, CancellationToken cancellationToken);
        Task<ResponseDataModel<bool>> ChangePasswordAsync( ChangePasswordDto dto, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> ForgotPasswordAsync( ForgotPasswordDto dto, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> ResetPasswordAsync( ResetPasswordDto dto, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> UpdateEmailAsync( UpdateEmailDto dto, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> ActivateUserAsync(int userId,bool isActive,CancellationToken cancellationToken);
        Task<ResponseDataModel<bool>> CompanyExistsAsync(int companyId, CancellationToken cancellationToken);
        Task<ResponseDataModel<bool>> BranchExistsAsync(int branchId, CancellationToken cancellationToken);
    }
}
