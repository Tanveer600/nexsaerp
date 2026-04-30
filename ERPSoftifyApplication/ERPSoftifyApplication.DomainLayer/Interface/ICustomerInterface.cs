using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface ICustomerInterface
    {
        Task<List<Customer>> GetAll( CancellationToken can);
        Task<Customer> GetById(int Id, CancellationToken can);
        Task<bool> DeleteCustomer(int Id, CancellationToken can);
        Task<Customer> UpDateCustomer(Customer model, CancellationToken can);
        Task<Customer> Create(Customer model, CancellationToken can);
    }
}
