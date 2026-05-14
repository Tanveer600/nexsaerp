using ERPSoftifyApplicatione.ApplicationLayer.DTO.DeliveryNoteDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.GoodReceived
{
   
    public class GoodReceivedViewDto
    {
        public int ID { get; set; }
        public string GRNNumber { get; set; }
        public int POId { get; set; }
        public DateTime Date { get; set; }
        public string VendorChallanNumber { get; set; }
        public string Remarks { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        public int WarehouseId { get; set; }
        public List<GoodReceivedViewItemDto> Items { get; set; } = new();
    }

  
    public class GoodReceivedViewItemDto
    {
        public int ID { get; set; }
        public int GoodsReceivedId { get; set; }
        public int ProductId { get; set; }
        public int TenantId { get; set; }
        public int BranchId { get; set; }
        public int QuantityReceived { get; set; }
        public int WarehouseId { get; set; }
        public string BatchNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int PurchaseOrderItemId { get; set; }
    }

 
    public class GoodReceivedRequestDto
    {
        public int POId { get; set; }
        public DateTime Date { get; set; }
        public string GRNNumber { get; set; }
        public string VendorChallanNumber { get; set; }
        public string Remarks { get; set; }
        public string Status { get; set; }
        public int WarehouseId { get; set; }
        public List<GoodReceivedViewItemDto> Items { get; set; } = new();
    }
}
