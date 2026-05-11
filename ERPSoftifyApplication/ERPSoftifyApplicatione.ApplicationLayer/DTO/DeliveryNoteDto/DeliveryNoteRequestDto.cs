using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.DeliveryNoteDto
{
    public class DeliveryNoteRequestDto
    {
        public int ID { get; set; }
        public int SaleOrderId { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string Remarks { get; set; }
        public List<DeliveryNoteItemDto> Items { get; set; }
    }

    public class DeliveryNoteItemDto
    {
        public int SalesOrderItemId { get; set; }
        public int ProductId { get; set; }
        public int CurrentQty { get; set; }
        public decimal QuantityDelivered { get; set; }
    }
    public class UpdateDeliveryNoteRequestDto
    {
        public int ID { get; set; }
        public int SaleOrderId { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string Remarks { get; set; }
        public List<DeliveryNoteItemDto> Items { get; set; }
    }

    public class UpdateDeliveryNoteItemDto
    {
        public int ID { get; set; }
        public int SalesOrderItemId { get; set; }
        public int ProductId { get; set; }
        public int CurrentQty { get; set; }
    }
}
