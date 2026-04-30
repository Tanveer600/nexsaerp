using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.CustomerDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface ICustomerService
    {
        Task<ResponseDataModel<CreateCustomerDto>> CreatecustomerAsync(CreateCustomerDto customer, CancellationToken cancellationToken);

        Task<ResponseDataModel<PagedResponse<CustomerDto>>> GetAllcustomerAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);

        Task<ResponseDataModel<CustomerDto>> GetcustomerByIdAsync(int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<UpdateCustomerDto>> UpdatecustomerAsync(int id, UpdateCustomerDto customer, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeletecustomerAsync(int id, CancellationToken cancellationToken);
    }
}
