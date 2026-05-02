using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.InfrastructureLayer.Repositories
{
    public class EmployeeRepository : IEmployeeInterface
    {
         private readonly DataContext _dataContext;

        public EmployeeRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
            
        }
      

        public async Task<Employee> Create(Employee model, CancellationToken can)
        {
            await _dataContext.Employees.AddAsync(model);
            await _dataContext.SaveChangesAsync(can);
            return model;
        }

        public async Task<bool> DeleteEmployee(int Id, CancellationToken can)
        {
          var delemployee= await _dataContext.Employees.FirstOrDefaultAsync(x=>x.ID==Id);
            if (delemployee==null) 
            return false;
            _dataContext.Employees.Remove(delemployee);
            await _dataContext.SaveChangesAsync(can);
            return true;
        }

        public async Task<List<Employee>> GetAll(CancellationToken can)
        {
            var list = await _dataContext.Employees.AsNoTracking().ToListAsync(can);
            return list;
        }

        public  async Task<Employee> GetById(int Id, CancellationToken can)
        {
            var list = await _dataContext.Employees.FirstOrDefaultAsync(c => c.ID == Id);
            return list;
        }

        public  async Task<Employee> UpDateEmployee(Employee model, CancellationToken can)
        {
            try
            {
                var list = await _dataContext.Employees.Where(c => c.ID == model.ID).FirstOrDefaultAsync();
                if (list != null)

                    _dataContext.Employees.Update(model);
                await _dataContext.SaveChangesAsync();
                return model;
            }
            catch (Exception ex)
            {

                throw;
            }

        }
    }
}
