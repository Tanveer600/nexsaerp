using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IEmployeeInterface
    {
        Task<List<Employee>> GetAll(CancellationToken can);
        Task<Employee> GetById(int Id, CancellationToken can);
        Task<bool> DeleteEmployee(int Id, CancellationToken can);
        Task<Employee> UpDateEmployee(Employee model, CancellationToken can);
        Task<Employee> Create(Employee model, CancellationToken can);
    }
}
