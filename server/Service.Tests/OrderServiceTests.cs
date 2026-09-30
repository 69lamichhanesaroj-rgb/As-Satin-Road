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


/*
 * TODO #23 (Rafal)
 * Featured vendor tests go in a new file VendorServiceTests.cs:
 *   IsFeatured(100) -> false, IsFeatured(101) -> true, IsFeatured(0) -> false
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

    /*
     * TODO #22 (Asim)
     * Discount tests, write them BEFORE the CalculateTotalPrice method (TDD: red -> green -> refactor).
     * Each test: arrange (price, quantity, earlier orders) -> act (call the method) -> assert (the price).
     *   10 earlier orders, price 100, quantity 1 -> 100 (no discount yet)
     *   11 earlier orders, price 100, quantity 1 -> 80
     *   0 earlier orders, price 50, quantity 2  -> 100
     * A [Theory] with [InlineData] can do all 3 in one test.
     */













    /*
     * TODO #24 (Saroj)
     * FBI raid tests, using a stub IRandomNumberGenerator (new small class in this project
     * that always returns the number you give it). Needs the test database from #25.
     *   stub returns 1  -> WasFbiRaid is true, the vendor is shut down, their listings are gone
     *   stub returns 50 -> normal order, WasFbiRaid is false
     */













}