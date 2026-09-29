using LinqToDB.Mapping;

namespace Infra.Entities;

[System.ComponentModel.DataAnnotations.Schema.Table("Orders")]
public class Order
{
    [PrimaryKey]
    public string OrderId { get; set; } = Guid.NewGuid().ToString();
    
    [Column, NotNull]
    public string BuyerId { get; set; } = string.Empty;
    
    [Column, NotNull]
    public string VendorId { get; set; } = string.Empty;
    
    [Column, NotNull]
    public string ListingId { get; set; } = string.Empty;
    
    [Column]
    public int Quantity { get; set; }
    
    [Column]
    public decimal TotalPrice { get; set; }
    
    [Column]
    public bool IsDiscountApplied { get; set; } = false;
    
    [Column, NotNull]
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    
}