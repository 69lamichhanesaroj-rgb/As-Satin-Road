using LinqToDB.Mapping;

namespace Infra.Entities;

[Table("Orders")]
public class Order
{
    [PrimaryKey]
    public string OrderId { get; set; } = Guid.NewGuid().ToString();
    
    /*
     * TODO #13 (Saroj)
     * After Vendor becomes User: BuyerId and VendorId are both user ids.
     * Nothing to change in this class, just check that OrderService uses real user ids.
     */
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