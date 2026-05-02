using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IProductInterface
    {
        Task<List<Product>> GetAll(CancellationToken can);
        Task<Product> GetById(int Id, CancellationToken can);
        Task<bool> DeleteProduct(int Id, CancellationToken can);
        Task<Product> UpDateProduct(Product model, CancellationToken can);
        Task<Product> CreateProduct(Product model, CancellationToken can);
    }
}
