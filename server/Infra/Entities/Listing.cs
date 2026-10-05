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

    [Association(ThisKey = nameof(CategoryId), OtherKey = nameof(Category.CategoryId))]
    public Category? Category { get; set; }

    // the seller is a normal user, VendorId holds their user id
    [Association(ThisKey = nameof(VendorId), OtherKey = nameof(User.Id))]
    public User? Vendor { get; set; }


}