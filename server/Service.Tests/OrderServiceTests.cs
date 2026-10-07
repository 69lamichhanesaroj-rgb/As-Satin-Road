using Infra.Entities;
using LinqToDB;
using Service;
using Service.Tests;

public class OrderServiceTests
{
    // stub: always returns the number you give it
    // 1 = raid, 50 = no raid
    private class FixedRandom : IRandomNumberGenerator
    {
        private readonly int _value;
        public FixedRandom(int value) => _value = value;
        public int Next(int min, int max) => _value;
    }

    [Fact]
    public void PlaceOrder_ZeroQuantity()
    {
        var service = new OrderService(null!, new FixedRandom(50));
        var dto = new PlaceOrderRequest("buyer1","listing1", 0);

        var warning = Assert.Throws<ValidationException>(() => service.PlaceOrder(dto));
        Assert.Equal("Quantity must be greater than 0", warning.Message);
    }

    [Fact]
    public void PlaceOrder_NegativeQuantity()
    {
        var service = new OrderService(null!, new FixedRandom(50));
        var dto = new PlaceOrderRequest("buyer1","listing1", -1);
        var warning = Assert.Throws<ValidationException>(() => service.PlaceOrder(dto));
        Assert.Equal("Quantity must be greater than 0", warning.Message);
    }

    [Fact]
    public void PlaceOrder_ListingNotFound()
    {
        using var db = TestDatabase.Create();
        var service = new OrderService(db, new FixedRandom(50));
        var dto = new PlaceOrderRequest("buyer1", "nothing", 1);

        var error = Assert.Throws<NotFoundException>(() => service.PlaceOrder(dto));
        Assert.Equal("Listing not found.", error.Message);
    }

    [Fact]
    public void PlaceOrder_NotEnoughStock()
    {
        using var db = TestDatabase.Create();
        db.Insert(new User { Id = "u1", UserName = "seller" });
        db.Insert(new Listing { ListingId = "l1", VendorId = "u1", CategoryId = 1, Title = "Knife", Price = 10, StockQuantity = 2 });
        var service = new OrderService(db, new FixedRandom(50));
        var dto = new PlaceOrderRequest("buyer1", "l1", 5);

        var error = Assert.Throws<ValidationException>(() => service.PlaceOrder(dto));
        Assert.Equal("Not enough stock available.", error.Message);
    }

    // a seller can't buy their own listing, the buyer id is the same as the seller id
    [Fact]
    public void PlaceOrder_OwnListing()
    {
        using var db = TestDatabase.Create();
        db.Insert(new User { Id = "u1", UserName = "seller" });
        db.Insert(new Listing { ListingId = "l1", VendorId = "u1", CategoryId = 1, Title = "Knife", Price = 10, StockQuantity = 5 });
        var service = new OrderService(db, new FixedRandom(50));
        var dto = new PlaceOrderRequest("u1", "l1", 1);

        var error = Assert.Throws<ValidationException>(() => service.PlaceOrder(dto));
        Assert.Equal("You can't buy your own listing", error.Message);
    }

    // 20% off after MORE than 10 earlier orders from the same vendor
    // InlineData = price, quantity, earlier orders, expected total
    [Theory]
    [InlineData(100, 1, 10, 100)]   // exactly 10 -> no discount yet
    [InlineData(100, 1, 11, 80)]    // 11 -> 20% off
    [InlineData(50, 2, 0, 100)]     // first order -> price x quantity
    public void CalculateTotalPrice_Discount(int price, int quantity, int earlierOrders, int expected)
    {
        var service = new OrderService(null!, new FixedRandom(50));

        var total = service.CalculateTotalPrice(price, quantity, earlierOrders);

        Assert.Equal((decimal)expected, total);
    }

    [Fact]
    public void PlaceOrder_Raid_WhenRandomIs1_ShutsDownVendorAndDeletesListings()
    {
        using var db = TestDatabase.Create();
        db.Insert(new User { Id = "u1", UserName = "seller" });
        db.Insert(new Listing { ListingId = "l1", VendorId = "u1", CategoryId = 1, Title = "Knife", Price = 10, StockQuantity = 5 });
        db.Insert(new Listing { ListingId = "l2", VendorId = "u1", CategoryId = 1, Title = "Rope", Price = 5, StockQuantity = 5 });
        var service = new OrderService(db, new FixedRandom(1));

        var result = service.PlaceOrder(new PlaceOrderRequest("buyer1", "l1", 1));

        Assert.True(result.WasFbiRaid);
        Assert.Null(result.Order);
        var vendor = db.Users.First(v => v.Id == "u1");
        Assert.True(vendor.IsShutDown);
        Assert.Empty(db.Listings.Where(l => l.VendorId == "u1").ToList());
        Assert.Empty(db.Orders.ToList());
    }

    [Fact]
    public void PlaceOrder_NoRaid_WhenRandomIs50_PlacesNormalOrder()
    {
        using var db = TestDatabase.Create();
        db.Insert(new User { Id = "u1", UserName = "seller" });
        db.Insert(new Listing { ListingId = "l1", VendorId = "u1", CategoryId = 1, Title = "Knife", Price = 10, StockQuantity = 5 });
        var service = new OrderService(db, new FixedRandom(50));

        var result = service.PlaceOrder(new PlaceOrderRequest("buyer1", "l1", 1));

        Assert.False(result.WasFbiRaid);
        Assert.NotNull(result.Order);
        Assert.Equal("Order placed successfully!", result.Message);
        var listing = db.Listings.First(l => l.ListingId == "l1");
        Assert.Equal(4, listing.StockQuantity);
    }
}
