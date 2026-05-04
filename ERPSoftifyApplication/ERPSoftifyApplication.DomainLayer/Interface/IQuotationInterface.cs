using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IQuotationInterface
    {
        Task<Quotation> CreateAsync(Quotation model, CancellationToken cancellationToken);
        Task<Quotation?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<List<Quotation>> GetAllAsync(CancellationToken cancellationToken);
        Task<Quotation> UpdateAsync(Quotation model, CancellationToken cancellationToken);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
    }
}
