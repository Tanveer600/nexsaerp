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
    public class PurchaseOrderService:IPurchaseOrderService
    {
        private readonly IPurchaseOrderInterface _PurchaseOrderRepository;

        public PurchaseOrderService(IPurchaseOrderInterface userRepository)
        {
            _PurchaseOrderRepository = userRepository;
        }

        public async Task<ResponseDataModel<PurchaseOrder>> CreatePurchaseOrderAsync(
            PurchaseOrder PurchaseOrder,
            CancellationToken cancellationToken)
        {
            //PurchaseOrder.CreatedAt = DateTime.UtcNow;

            var result = await _PurchaseOrderRepository.CreateAsync(PurchaseOrder, cancellationToken);

            return ResponseDataModel<PurchaseOrder>.SuccessResponse(result, "PurchaseOrder created successfully");
        }

        public async Task<ResponseDataModel<List<PurchaseOrder>>> GetAllPurchaseOrdersAsync(
            CancellationToken cancellationToken)
        {
            var result = await _PurchaseOrderRepository.GetAllAsync(cancellationToken);

            return ResponseDataModel<List<PurchaseOrder>>.SuccessResponse(result);
        }

        public async Task<ResponseDataModel<PurchaseOrder>> GetPurchaseOrderByIdAsync(
            int id,
            CancellationToken cancellationToken)
        {
            var PurchaseOrder = await _PurchaseOrderRepository.GetByIdAsync(id, cancellationToken);

            if (PurchaseOrder == null)
                return ResponseDataModel<PurchaseOrder>.FailureResponse("PurchaseOrder not found");

            return ResponseDataModel<PurchaseOrder>.SuccessResponse(PurchaseOrder);
        }

        public async Task<ResponseDataModel<PurchaseOrder>> UpdatePurchaseOrderAsync(
            int id,
            PurchaseOrder PurchaseOrder,
            CancellationToken cancellationToken)
        {
            var existing = await _PurchaseOrderRepository.GetByIdAsync(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<PurchaseOrder>.FailureResponse("PurchaseOrder not found");

            existing.Status = PurchaseOrder.Status;
            existing.OrderDate = PurchaseOrder.OrderDate;
            existing.TenantId = PurchaseOrder.TenantId;
            existing.BranchId = PurchaseOrder.BranchId;
            existing.VendorId = PurchaseOrder.VendorId;
          


            var updated = await _PurchaseOrderRepository.UpdateAsync(existing, cancellationToken);

            return ResponseDataModel<PurchaseOrder>.SuccessResponse(updated, "PurchaseOrder updated successfully");
        }

        public async Task<ResponseDataModel<bool>> DeletePurchaseOrderAsync(
            int id,
            CancellationToken cancellationToken)
        {
            var exists = await _PurchaseOrderRepository.GetByIdAsync(id, cancellationToken);

            if (exists == null)
                return ResponseDataModel<bool>.FailureResponse("PurchaseOrder not found");

            var deleted = await _PurchaseOrderRepository.DeleteAsync(id, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(deleted, "PurchaseOrder deleted successfully");
        }

    }
}
