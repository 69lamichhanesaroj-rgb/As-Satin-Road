using LinqToDB.Mapping;

namespace Infra.Entities;

[Table("Listing")]
public class Listing
{
    [PrimaryKey]
    public string ListingId { get; set; } = Guid.NewGuid().ToString();
    
    [Column, NotNull]
    public string VendorId { get; set; } = string.Empty;
    
    [Column]
    public int CategoryId { get; set; }
    
    [Column, NotNull]
    public string Title { get; set; } = string.Empty;
    
    [Column]
    public decimal Price { get; set; }
    
    [Column]
    public int StockQuantity { get; set; }
}