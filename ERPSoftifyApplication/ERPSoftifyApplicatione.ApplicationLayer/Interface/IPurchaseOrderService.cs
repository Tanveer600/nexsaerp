using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IPurchaseOrderService
    {
        Task<ResponseDataModel<PurchaseOrder>> CreatePurchaseOrderAsync(PurchaseOrder PurchaseOrder, CancellationToken cancellationToken);

        Task<ResponseDataModel<List<PurchaseOrder>>> GetAllPurchaseOrdersAsync(CancellationToken cancellationToken);

        Task<ResponseDataModel<PurchaseOrder>> GetPurchaseOrderByIdAsync(int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<PurchaseOrder>> UpdatePurchaseOrderAsync(int id, PurchaseOrder PurchaseOrder, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeletePurchaseOrderAsync(int id, CancellationToken cancellationToken);
    }
}
