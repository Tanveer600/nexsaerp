using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.GoodReceived; // Sahi namespace use karein
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IGoodReceivedService
    {
        // Pagination ke saath list hasil karne ke liye
        Task<ResponseDataModel<PagedResponse<GoodReceivedViewDto>>> GetAllGoodReceiveds(int pageNumber, int pageSize, CancellationToken cancellationToken);

        // Baghair pagination ke simple list ke liye
        Task<List<GoodReceivedViewDto>> GetAllGoodReceiveds(CancellationToken ct);

        // Single record ID se fetch karne ke liye
        Task<GoodReceivedViewDto> GetGoodReceivedById(int id, CancellationToken ct);

        // Delete operation
        Task<bool> DeleteGoodReceived(int id, CancellationToken ct);

        // --- FIX: Yahan 'GoodReceivedRequestDto' hona chahiye 'GoodReceivedViewDto' nahi ---
        Task<ResponseDataModel<string>> CreateGoodReceived(GoodReceivedRequestDto request, CancellationToken ct);

        // Save changes asynchronosly
        Task<int> SaveChangesAsync(CancellationToken ct);
    }
}