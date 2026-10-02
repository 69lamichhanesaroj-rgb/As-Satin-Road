using LinqToDB.Mapping;

namespace Infra.Entities;

[Table("Listing")]
public class Listing
{
    [PrimaryKey] public string ListingId { get; set; } = Guid.NewGuid().ToString();

    [Column, NotNull] public string VendorId { get; set; } = string.Empty;

    [Column] public int CategoryId { get; set; }

    [Column, NotNull] public string Title { get; set; } = string.Empty;

    [Column] public decimal Price { get; set; }

    [Column] public int StockQuantity { get; set; }

    /*
     * TODO #13 (Saroj)
     * Change Vendor and VendorId to User and UserId, see Vendor.cs.
     */ 

    [Association(ThisKey = nameof(CategoryId), OtherKey = nameof(Category.CategoryId))]
    public Category? Category { get; set; }

    [Association(ThisKey = nameof(VendorId), OtherKey = nameof(Vendor.VendorId))]
    public Vendor? Vendor { get; set; }


}