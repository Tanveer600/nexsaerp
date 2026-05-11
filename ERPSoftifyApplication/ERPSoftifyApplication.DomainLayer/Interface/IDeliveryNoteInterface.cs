using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IDeliveryNoteInterface
    {
        Task AddAsync(DeliveryNote entity, CancellationToken ct);
        Task<DeliveryNote> GetByIdAsync(int id, CancellationToken ct);
        Task<List<DeliveryNote>> GetAll(CancellationToken can);
        Task<bool> DeleteDeliveryNote(int Id, CancellationToken can);
        Task<DeliveryNote> UpDateDeliveryNote(DeliveryNote model, CancellationToken can);
        Task<DeliveryNote> CreateDeliveryNote(DeliveryNote model, CancellationToken can);
        Task<object> BeginTransactionAsync(CancellationToken ct);
        Task SaveChangesAsync(CancellationToken ct);
    }
}
