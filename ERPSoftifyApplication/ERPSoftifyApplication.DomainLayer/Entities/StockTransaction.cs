using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERPSoftifyApplication.DomainLayer.Entities
{
    public class StockTransaction : IMustHaveTenant, IMustHaveBranch
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

        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; }
    }
}