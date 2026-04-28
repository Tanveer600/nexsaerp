using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IPurchaseOrderItemService
    {
        Task<ResponseDataModel<PurchaseOrderItem>> CreatePurchaseOrderItemAsync(PurchaseOrderItem PurchaseOrderItem, CancellationToken cancellationToken);

        Task<ResponseDataModel<List<PurchaseOrderItem>>> GetAllPurchaseOrderItemsAsync(CancellationToken cancellationToken);

        Task<ResponseDataModel<PurchaseOrderItem>> GetPurchaseOrderItemByIdAsync(int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<PurchaseOrderItem>> UpdatePurchaseOrderItemAsync(int id, PurchaseOrderItem PurchaseOrderItem, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeletePurchaseOrderItemAsync(int id, CancellationToken cancellationToken);
    }
}
