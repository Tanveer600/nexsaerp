using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class BranchService:IBranchService
    {
        private readonly IBranchInterface _BranchRepository;
        private readonly ICurrentUserService _currentUserService;

        public BranchService(IBranchInterface branchRepository, ICurrentUserService currentUserService)
        {
            _BranchRepository = branchRepository;
            _currentUserService = currentUserService;
        }

        public async Task<ResponseDataModel<BranchDto>> CreateBranchAsync(
            BranchDto dto,
            CancellationToken cancellationToken)
        {
            var branch = new Branch
            {
                Name = dto.Name,
                Address = dto.Address,
                Phone = dto.Phone,
                TenantId = _currentUserService.TenantId,
                ParentBranchId = dto.ParentBranchId > 0 ? dto.ParentBranchId : null,
                CreatedAt = DateTime.UtcNow,
                City= dto.City, 
                Code = dto.Code,
                Emirate = dto.Emirate,
                IsDefault = dto.IsDefault,
                EmployeeCount = dto.EmployeeCount,
                Street = dto.Street,
                IsActive=dto.IsActive,

            };

            var result = await _BranchRepository.CreateAsync(branch, cancellationToken);

            dto.Id = result.Id;
            dto.CreatedAt = result.CreatedAt;
            dto.IsActive = result.IsActive;

            return ResponseDataModel<BranchDto>.SuccessResponse(dto, "Branch created successfully");
        }

        public async Task<ResponseDataModel<List<BranchDto>>> GetAllBranchsAsync(CancellationToken cancellationToken)
        {
            var branches = await _BranchRepository.GetAllAsync(cancellationToken);

            var dtoList = branches.Select(b => new BranchDto
            {
                Id = b.Id,
                Name = b.Name,
                Address = b.Address,
                Phone = b.Phone,
                Code=b.Code,
                City=b.City,
                TenantId = b.TenantId,
                ParentBranchId = b.ParentBranchId,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt,
                IsActive = b.IsActive,
                ParentBranchName = b.ParentBranch?.Name
            }).ToList();

            return ResponseDataModel<List<BranchDto>>.SuccessResponse(dtoList);
        }

        public async Task<ResponseDataModel<BranchDto>> GetBranchByIdAsync(int id, CancellationToken cancellationToken)
        {
            var branch = await _BranchRepository.GetByIdAsync(id, cancellationToken);
            if (branch == null)
                return ResponseDataModel<BranchDto>.FailureResponse("Branch not found");

            var dto = new BranchDto
            {
                Id = branch.Id,
                Name = branch.Name,
                Address = branch.Address,
                Phone = branch.Phone,
                Code=branch.Code,
                TenantId = branch.TenantId,
                ParentBranchId = branch.ParentBranchId,
                CreatedAt = branch.CreatedAt,
                UpdatedAt = branch.UpdatedAt,
                IsActive = branch.IsActive,
                ParentBranchName = branch.ParentBranch?.Name,
                City=branch.City,
                Emirate=branch.Emirate,
                EmployeeCount=branch.EmployeeCount,
                IsDefault=branch.IsDefault,
                
            };

            return ResponseDataModel<BranchDto>.SuccessResponse(dto);
        }

        public async Task<ResponseDataModel<BranchDto>> UpdateBranchAsync(int id, BranchDto dto, CancellationToken cancellationToken)
        {
            var existing = await _BranchRepository.GetByIdAsync(id, cancellationToken);
            if (existing == null)
                return ResponseDataModel<BranchDto>.FailureResponse("Branch not found");

            existing.Name = dto.Name;
            existing.Address = dto.Address;
            existing.Phone = dto.Phone;
            existing.ParentBranchId = dto.ParentBranchId;
            existing.UpdatedAt = DateTime.UtcNow;
            existing.IsActive = dto.IsActive;
            existing.IsDefault = dto.IsDefault;
            existing.Code = dto.Code;
            existing.Emirate = dto.Emirate;
            existing.Street = dto.Street;
            existing.City = dto.City;
            existing.EmployeeCount = dto.EmployeeCount;

            var updated = await _BranchRepository.UpdateAsync(existing, cancellationToken);

            dto.Id = updated.Id;
            dto.CreatedAt = updated.CreatedAt;
            dto.UpdatedAt = updated.UpdatedAt;

            return ResponseDataModel<BranchDto>.SuccessResponse(dto, "Branch updated successfully");
        }

        public async Task<ResponseDataModel<bool>> DeleteBranchAsync(int id, CancellationToken cancellationToken)
        {
            var existing = await _BranchRepository.GetByIdAsync(id, cancellationToken);
            if (existing == null)
                return ResponseDataModel<bool>.FailureResponse("Branch not found");

            // Soft delete
            existing.IsActive = false;
            existing.UpdatedAt = DateTime.UtcNow;
            await _BranchRepository.UpdateAsync(existing, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(true, "Branch deleted (soft delete) successfully");
        }
    }
}
