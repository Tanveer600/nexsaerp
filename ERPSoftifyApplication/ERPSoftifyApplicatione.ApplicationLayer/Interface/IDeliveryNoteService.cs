using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.DeliveryNoteDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IDeliveryNoteService
    {
        Task<ResponseDataModel<PagedResponse<DeliveryNoteRequestDto>>> GetAllDeliveryNotes(int pageNumber, int pageSize, CancellationToken cancellationToken);
        Task<List<DeliveryNoteRequestDto>> GetAllDeliveryNotes(CancellationToken ct);
        Task<DeliveryNoteRequestDto> GetDeliveryNoteById(int id, CancellationToken ct);
        Task<bool> DeleteDeliveryNote(int id, CancellationToken ct);
        Task<ResponseDataModel<string>> CreateDeliveryNote(DeliveryNoteRequestDto request, CancellationToken ct);
        Task<int> SaveChangesAsync(CancellationToken ct);
    }
}
