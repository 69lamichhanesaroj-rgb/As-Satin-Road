using Infra.Entities;
using LinqToDB;
using Service;
using Service.Tests;

public class OrderServiceTests
{
    [Fact]
    public void PlaceOrder_ZeroQuantity()
    {
        var service = new OrderService(null!);
        var dto = new PlaceOrderRequest("buyer1","listing1", 0);
        
        var warning = Assert.Throws<Exception>(() => service.PlaceOrder(dto));
        Assert.Equal("Quantity must be greater than 0", warning.Message);
    }

    [Fact]
    public void PlaceOrder_NegativeQuantity()
    {
        var service = new OrderService(null!);
        var dto = new PlaceOrderRequest("buyer1","listing1", -1);
        var warning = Assert.Throws<Exception>(() => service.PlaceOrder(dto));
        Assert.Equal("Quantity must be greater than 0", warning.Message);
    }

    [Fact]
    public void PlaceOrder_ListingNotFound()
    {
        using var db = TestDatabase.Create();
        var service = new OrderService(db);
        var dto = new PlaceOrderRequest("buyer1", "nothing", 1);

        var error = Assert.Throws<Exception>(() => service.PlaceOrder(dto));
        Assert.Equal("Listing not found.", error.Message);
    }

    [Fact]
    public void PlaceOrder_NotEnoughStock()
    {
        using var db = TestDatabase.Create();
        db.Insert(new User { Id = "u1", UserName = "seller" });
        db.Insert(new Listing { ListingId = "l1", VendorId = "u1", CategoryId = 1, Title = "Knife", Price = 10, StockQuantity = 2 });
        var service = new OrderService(db);
        var dto = new PlaceOrderRequest("buyer1", "l1", 5);

        var error = Assert.Throws<Exception>(() => service.PlaceOrder(dto));
        Assert.Equal("Not enough stock available.", error.Message);
    }

    // a normal order test needs the FBI raid stub first (#24), now there is a 1% random raid

    // 20% off after MORE than 10 earlier orders from the same vendor
    // InlineData = price, quantity, earlier orders, expected total
    [Theory]
    [InlineData(100, 1, 10, 100)]   // exactly 10 -> no discount yet
    [InlineData(100, 1, 11, 80)]    // 11 -> 20% off
    [InlineData(50, 2, 0, 100)]     // first order -> price x quantity
    public void CalculateTotalPrice_Discount(int price, int quantity, int earlierOrders, int expected)
    {
        var service = new OrderService(null!);

        var total = service.CalculateTotalPrice(price, quantity, earlierOrders);

        Assert.Equal((decimal)expected, total);
    }

    /*
     * TODO #24 (Saroj)
     * FBI raid tests, using a stub IRandomNumberGenerator (new small class in this project
     * that always returns the number you give it). Needs the test database from #25.
     *   stub returns 1  -> WasFbiRaid is true, the vendor is shut down, their listings are gone
     *   stub returns 50 -> normal order, WasFbiRaid is false
     */













}