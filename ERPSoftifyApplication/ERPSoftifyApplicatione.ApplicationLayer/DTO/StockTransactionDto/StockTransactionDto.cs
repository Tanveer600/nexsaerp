using ERPSoftifyApplicatione.ApplicationLayer.DTO.DeliveryNoteDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.StockTransactionDto
{
    public class StockTransactionDto
    {

        public int ProductId { get; set; }

        public string TransactionType { get; set; }

        public int ReferenceId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public DateTime TransactionDate { get; set; }

        public string Remarks { get; set; }

        public int BranchId { get; set; }

        public int TenantId { get; set; }
    }
    public class UpdateStockTransactionDto
    {
        public int ID { get; set; }

        public int ProductId { get; set; }

        public string TransactionType { get; set; }

        public int ReferenceId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public DateTime TransactionDate { get; set; }

        public string Remarks { get; set; }

        public int BranchId { get; set; }

        public int TenantId { get; set; }
    }

}
