using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IInvoiceInterface
    {
        Task<List<Invoice>> GetAll(CancellationToken can);
        Task<Invoice> GetById(int Id, CancellationToken can);
        Task<bool> DeleteInvoice(int Id, CancellationToken can);
        Task<Invoice> UpDateInvoice(Invoice model, CancellationToken can);
        Task<Invoice> CreateInvoice(Invoice model, CancellationToken can);
        Task UpdateInvoiceStatusAsync(int invoiceId, string status, CancellationToken cancellationToken);
    }
}
