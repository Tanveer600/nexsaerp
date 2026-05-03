using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.EmployeeDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public  interface IEmployeeService 
    {
        Task<ResponseDataModel<CreateEmployeeDto>> CreateEmployeeAsync(CreateEmployeeDto Employee, CancellationToken cancellationToken);

        Task<ResponseDataModel<PagedResponse<EmployeeDto>>> GetAllEmployeeAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);

        Task<ResponseDataModel<EmployeeDto>> GetEmployeeByIdAsync(int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<UpdateEmployeeDto>> UpdateEmployeeAsync(int id, UpdateEmployeeDto Employee, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeleteEmployeeAsync(int id, CancellationToken cancellationToken);
    }
}
