namespace ERPSoftifyApplicatione.ApplicationLayer.DTO.Quotation
{
    public class QuotationViewDto
    {
        public int QuotationId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public DateTime QuotationDate { get; set; }
        public DateTime ValidUntil { get; set; }
        public string QuotationNumber { get; set; }
        public string Status { get; set; }
        public List<QuotationItemViewDto> Items { get; set; } = new();
        public decimal TotalDiscount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal SubTotal { get; set; }
        public decimal NetAmount { get; set; }
        public decimal GrandTotal { get; set; }
    }

    public class QuotationItemViewDto
    {
        public int ItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal LineTotal { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal TaxPercentage { get; set; }
    }

    public class CreateQuotationRequest
    {
        public int CustomerId { get; set; }
        public DateTime QuotationDate { get; set; }
        public DateTime ValidUntil { get; set; }
        public string QuotationNumber { get; set; }
        public string Status { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal NetAmount { get; set; }

        public List<CreateQuotationItemRequest> Items { get; set; } = new();
    }

    public class CreateQuotationItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal LineTotal { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal TaxPercentage { get; set; }
        public decimal DiscountAmount { get; set; }

    }

    public class UpdateQuotationRequest
    {
        public int QuotationId { get; set; }
        public int CustomerId { get; set; }
        public DateTime QuotationDate { get; set; }
        public DateTime ValidUntil { get; set; }
        public string QuotationNumber { get; set; }
        public string Status { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal NetAmount { get; set; }
        public decimal LineTotal { get; set; }

        public List<UpdateQuotationItemRequest> Items { get; set; } = new();
    }

    public class UpdateQuotationItemRequest
    {
        public int? ID { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal LineTotal { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal TaxPercentage { get; set; }

    }
}
