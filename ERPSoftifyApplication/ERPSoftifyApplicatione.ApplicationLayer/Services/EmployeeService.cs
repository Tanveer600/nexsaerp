using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.EmployeeDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeInterface _employeeRepository;
        private readonly ICurrentUserService _currentUserService;

        public EmployeeService(IEmployeeInterface employeerepository, ICurrentUserService currentUserService)
        {
            _employeeRepository = employeerepository;
            _currentUserService = currentUserService;
        }
        public async Task<ResponseDataModel<CreateEmployeeDto>> CreateEmployeeAsync(CreateEmployeeDto dto, CancellationToken cancellationToken)
        {
            var employee = new Employee
            {
                Name = dto.Name,
                Salary = dto.Salary,
                Documents = dto.Documents,
                BranchId = _currentUserService.BranchId,
                TenantId = _currentUserService.TenantId,
                RoleId = _currentUserService.RoleId,
            };
            var result = await _employeeRepository.Create(employee, cancellationToken);
            return ResponseDataModel<CreateEmployeeDto>.SuccessResponse(dto, "Employee created successfully");
        }

        public async  Task<ResponseDataModel<bool>> DeleteEmployeeAsync(int id, CancellationToken cancellationToken)
        {
            var existing = await _employeeRepository.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<bool>.FailureResponse("Employee not found");
            await _employeeRepository.DeleteEmployee(existing.ID, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(true, "Employee deleted successfully");

        }

        public async Task<ResponseDataModel<PagedResponse<EmployeeDto>>> GetAllEmployeeAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = await _employeeRepository.GetAll(cancellationToken);
            var totalCount = query.Count();
            var employees = query.OrderByDescending(x => x.ID)
                  .Skip((pageNumber - 1) * pageSize).Take(pageSize).Select(b => new EmployeeDto
                  {
                      ID = b.ID,
                      Name = b.Name,
                      Salary = b.Salary,
                      Documents = b.Documents
                  }).ToList();
            var pagedData = new PagedResponse<EmployeeDto>
            {
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize,
                Items = employees
            };
            return ResponseDataModel<PagedResponse<EmployeeDto>>.SuccessResponse(pagedData);
        }

        public async Task<ResponseDataModel<EmployeeDto>> GetEmployeeByIdAsync(int id, CancellationToken cancellationToken)
        {
            var employee = await _employeeRepository.GetById(id, cancellationToken);

            if (employee == null)
                return ResponseDataModel<EmployeeDto>.FailureResponse("employee not found");

            var dto = new EmployeeDto
            {
                ID = employee.ID,
                Name = employee.Name,
                Salary = employee.Salary,
                Documents = employee.Documents
                // TenantId = employee.TenantId,

            };

            return ResponseDataModel<EmployeeDto>.SuccessResponse(dto);
        }

        public async Task<ResponseDataModel<UpdateEmployeeDto>> UpdateEmployeeAsync(int id, UpdateEmployeeDto dto, CancellationToken cancellationToken)
        {
            var existing = await _employeeRepository.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<UpdateEmployeeDto>.FailureResponse("Employee not found");


            existing.Name = dto.Name;
            existing.Salary = dto.Salary;
            existing.Documents = dto.Documents;

            await _employeeRepository.UpDateEmployee(existing, cancellationToken);

            return ResponseDataModel<UpdateEmployeeDto>.SuccessResponse(dto, "Employee updated successfully");
        }
    }
}