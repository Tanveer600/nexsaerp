using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IPaymentInterface
    {
        Task<List<Payment>> GetAll(CancellationToken can);
        Task<Payment> GetById(int Id, CancellationToken can);
        Task<bool> DeletePayment(int Id, CancellationToken can);
        Task<Payment> UpDatePayment(Payment model, CancellationToken can);
        Task<Payment> Create(Payment model, CancellationToken can);
    }
}
