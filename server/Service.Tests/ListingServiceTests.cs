using Infra.Entities;
using LinqToDB;

namespace Service.Tests;

public class ListingServiceTests
{
    [Fact]
    public void CreateListing_UnknownVendor()
    {
        using var db = TestDatabase.Create();
        var service = new ListingService(db);
        var dto = new CreateListingRequest("nobody", 1, "Knife", 10, 5);

        var error = Assert.Throws<NotFoundException>(() => service.CreateListing(dto));
        Assert.Equal("Vendor not found", error.Message);
    }

    [Fact]
    public void CreateListing_ShutDownVendor()
    {
        using var db = TestDatabase.Create();
        db.Insert(new User { Id = "u1", UserName = "seller", IsShutDown = true });
        db.Insert(new Category { CategoryId = 1, CategoryName = "Weapons" });
        var service = new ListingService(db);
        var dto = new CreateListingRequest("u1", 1, "Knife", 10, 5);

        var error = Assert.Throws<ValidationException>(() => service.CreateListing(dto));
        Assert.Equal("Vendor is shut down", error.Message);
    }

    [Fact]
    public void CreateListing_PriceZero()
    {
        using var db = TestDatabase.Create();
        db.Insert(new User { Id = "u1", UserName = "seller" });
        db.Insert(new Category { CategoryId = 1, CategoryName = "Weapons" });
        var service = new ListingService(db);
        var dto = new CreateListingRequest("u1", 1, "Knife", 0, 5);

        var error = Assert.Throws<ValidationException>(() => service.CreateListing(dto));
        Assert.Equal("Price must be greater than zero", error.Message);
    }

    [Fact]
    public void CreateListing_Valid_ShowsCategoryAndSellerName()
    {
        using var db = TestDatabase.Create();
        db.Insert(new User { Id = "u1", UserName = "seller" });
        db.Insert(new Category { CategoryId = 1, CategoryName = "Weapons" });
        var service = new ListingService(db);
        var dto = new CreateListingRequest("u1", 1, "Knife", 10, 5);

        var listing = service.CreateListing(dto);

        Assert.Equal("Weapons", listing.CategoryName);
        Assert.Equal("seller", listing.VendorName);
        Assert.Single(service.GetActiveListings());
    }
}
