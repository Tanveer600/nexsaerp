using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Enums; // Enum ke liye
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.CustomerDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerInterface _customerInterface;
        private readonly ICurrentUserService _currentUserService;
        public CustomerService(ICustomerInterface customerInterface, ICurrentUserService currentUserService)
        {
            _customerInterface = customerInterface;
            _currentUserService = currentUserService;
        }

        public async Task<ResponseDataModel<CreateCustomerDto>> CreatecustomerAsync(CreateCustomerDto dto, CancellationToken cancellationToken)
        {
            var customer = new Customer
            {
                Name = dto.Name,
                Address = dto.Address,
                Phone = dto.Phone,
                Email = dto.Email,             
                BranchId = _currentUserService.BranchId,
                TenantId = _currentUserService.TenantId,

                //City = dto.City,
                //TenantId = dto.TenantId, 
                //CreatedAt = DateTime.UtcNow,
                //Status = RecordStatus.Active // Default Active
            };

            var result = await _customerInterface.Create(customer, cancellationToken);
            return ResponseDataModel<CreateCustomerDto>.SuccessResponse(dto, "Customer created successfully");
        }

        public async Task<ResponseDataModel<PagedResponse<CustomerDto>>> GetAllcustomerAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = await _customerInterface.GetAll(cancellationToken);

            var totalCount = query.Count();

            var customers = query
                .OrderByDescending(x => x.ID)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                         .Select(b => new CustomerDto
                         {
                             ID=b.ID,
                             Name = b.Name,
                             Address = b.Address,
                             Email = b.Email,
                             Phone = b.Phone
                         }).ToList();

            var pagedData = new PagedResponse<CustomerDto>
            {
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize,
                Items = customers
            };

            return ResponseDataModel<PagedResponse<CustomerDto>>.SuccessResponse(pagedData);
        }

        public async Task<ResponseDataModel<CustomerDto>> GetcustomerByIdAsync(int id, CancellationToken cancellationToken)
        {
            var customer = await _customerInterface.GetById(id, cancellationToken);

            if (customer == null)
                return ResponseDataModel<CustomerDto>.FailureResponse("Customer not found");

            var dto = new CustomerDto
            {
                ID = customer.ID,
                Name = customer.Name,
                Address = customer.Address,
                Phone = customer.Phone,
                Email = customer.Email,
               // TenantId = customer.TenantId,

            };

            return ResponseDataModel<CustomerDto>.SuccessResponse(dto);
        }

        public async Task<ResponseDataModel<UpdateCustomerDto>> UpdatecustomerAsync(int id, UpdateCustomerDto dto, CancellationToken cancellationToken)
        {
            var existing = await _customerInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<UpdateCustomerDto>.FailureResponse("Customer not found");

            // Map updated values
            existing.Name = dto.Name;
            existing.Address = dto.Address;
            existing.Phone = dto.Phone;
            existing.Email = dto.Email;

            // Yahan ensure karein ke aapka Repository internally _context.Update(existing) aur _context.SaveChangesAsync() kar raha hai
            await _customerInterface.UpDateCustomer(existing, cancellationToken);

            return ResponseDataModel<UpdateCustomerDto>.SuccessResponse(dto, "Customer updated successfully");
        }

       
        public async Task<ResponseDataModel<bool>> DeletecustomerAsync(int id, CancellationToken cancellationToken)
        {
            var existing = await _customerInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<bool>.FailureResponse("Customer not found");



            await _customerInterface.DeleteCustomer(existing.ID, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(true, "Customer deleted successfully");
        }
    }
}