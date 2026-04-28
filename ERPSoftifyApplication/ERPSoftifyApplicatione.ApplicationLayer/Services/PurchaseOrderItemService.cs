using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class PurchaseOrderItemService:IPurchaseOrderItemService
    {
        private readonly IPurchaseOrderItemItemInterface _PurchaseOrderItemRepository;

        public PurchaseOrderItemService(IPurchaseOrderItemItemInterface userRepository)
        {
            _PurchaseOrderItemRepository = userRepository;
        }

        public async Task<ResponseDataModel<PurchaseOrderItem>> CreatePurchaseOrderItemAsync(
            PurchaseOrderItem PurchaseOrderItem,
            CancellationToken cancellationToken)
        {
            //PurchaseOrderItem.CreatedAt = DateTime.UtcNow;

            var result = await _PurchaseOrderItemRepository.CreateAsync(PurchaseOrderItem, cancellationToken);

            return ResponseDataModel<PurchaseOrderItem>.SuccessResponse(result, "PurchaseOrderItem created successfully");
        }

        public async Task<ResponseDataModel<List<PurchaseOrderItem>>> GetAllPurchaseOrderItemsAsync(
            CancellationToken cancellationToken)
        {
            var result = await _PurchaseOrderItemRepository.GetAllAsync(cancellationToken);

            return ResponseDataModel<List<PurchaseOrderItem>>.SuccessResponse(result);
        }

        public async Task<ResponseDataModel<PurchaseOrderItem>> GetPurchaseOrderItemByIdAsync(
            int id,
            CancellationToken cancellationToken)
        {
            var PurchaseOrderItem = await _PurchaseOrderItemRepository.GetByIdAsync(id, cancellationToken);

            if (PurchaseOrderItem == null)
                return ResponseDataModel<PurchaseOrderItem>.FailureResponse("PurchaseOrderItem not found");

            return ResponseDataModel<PurchaseOrderItem>.SuccessResponse(PurchaseOrderItem);
        }

        public async Task<ResponseDataModel<PurchaseOrderItem>> UpdatePurchaseOrderItemAsync(
            int id,
            PurchaseOrderItem PurchaseOrderItem,
            CancellationToken cancellationToken)
        {
            var existing = await _PurchaseOrderItemRepository.GetByIdAsync(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<PurchaseOrderItem>.FailureResponse("PurchaseOrderItem not found");

            existing.UnitPrice = PurchaseOrderItem.UnitPrice;
            existing.Quantity = PurchaseOrderItem.Quantity;
            existing.TenantId = PurchaseOrderItem.TenantId;
            existing.ProductId = PurchaseOrderItem.ProductId;
            existing.POId = PurchaseOrderItem.POId;
          



            var updated = await _PurchaseOrderItemRepository.UpdateAsync(existing, cancellationToken);

            return ResponseDataModel<PurchaseOrderItem>.SuccessResponse(updated, "PurchaseOrderItem updated successfully");
        }

        public async Task<ResponseDataModel<bool>> DeletePurchaseOrderItemAsync(
            int id,
            CancellationToken cancellationToken)
        {
            var exists = await _PurchaseOrderItemRepository.GetByIdAsync(id, cancellationToken);

            if (exists == null)
                return ResponseDataModel<bool>.FailureResponse("PurchaseOrderItem not found");

            var deleted = await _PurchaseOrderItemRepository.DeleteAsync(id, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(deleted, "PurchaseOrderItem deleted successfully");
        }

    }
}
