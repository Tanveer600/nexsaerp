using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public  interface ICategoryInterface
    {
        Task<List<Category>> GetAll(CancellationToken can);
        Task<Category> GetById(int Id, CancellationToken can);
        Task<bool> DeleteCategory(int Id, CancellationToken can);
        Task<Category> UpDateCategory(Category model, CancellationToken can);
        Task<Category> Create(Category model, CancellationToken can);
    }
}
