using Service;

/*
 * TODO #25 (Asim)
 * Test database: a small class (new file TestDatabase.cs in this project) that makes an
 * in-memory SQLite database, creates the 4 tables and gives back a MyDatabaseConnection.
 * Every test gets a fresh, empty database, so tests don't mess with each other or with dev.db.
 * Then write tests for the rules that need the database:
 *   CreateListing: unknown vendor -> error, shut down vendor -> error, price 0 -> error
 *   PlaceOrder: listing not found -> error, not enough stock -> error, normal order -> stock goes down
 */

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