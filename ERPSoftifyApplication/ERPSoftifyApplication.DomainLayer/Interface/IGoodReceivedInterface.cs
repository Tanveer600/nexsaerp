using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer.Interface
{
    public interface IGoodReceivedInterface
    {
        Task AddAsync(GoodsReceived entity, CancellationToken ct);
        Task<GoodsReceived> GetByIdAsync(int id, CancellationToken ct);
        Task<List<GoodsReceived>> GetAll(CancellationToken can);
        Task<bool> DeleteGoodsReceived(int Id, CancellationToken can);
        Task<GoodsReceived> UpDateGoodsReceived(GoodsReceived model, CancellationToken can);
        Task<GoodsReceived> CreateGoodsReceived(GoodsReceived model, CancellationToken can);
        Task<object> BeginTransactionAsync(CancellationToken ct);

        // FIX: Return type ko Task<int> karein taake SaveChangesAsync ka result return ho sakay
        Task<int> SaveChangesAsync(CancellationToken ct);
    }
}
