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

    /*
     * TODO #17 (Rafal)
     * Add 2 associations (links to other tables):
     *   one to Category (ThisKey = CategoryId, OtherKey = Category.CategoryId)
     *   one to Vendor / User (ThisKey = VendorId, OtherKey = the user's id)
     *
     * Why: then a query can load the category name and the seller name together
     * with the listing (LoadWith), and the listing response can show them.
     */




}