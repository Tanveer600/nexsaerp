using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IVendorQuotationInterface
    {
        Task<VendorQuotation> CreateAsync(VendorQuotation model, CancellationToken cancellationToken);
        Task<VendorQuotation?> GetByIdAsync(int id, CancellationToken cancellationToken);
        Task<List<VendorQuotation>> GetAllAsync(CancellationToken cancellationToken);
        Task<VendorQuotation> UpdateAsync(VendorQuotation model, CancellationToken cancellationToken);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
    }
}
