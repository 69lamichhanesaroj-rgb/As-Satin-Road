using Infra;
using Infra.Entities;
using LinqToDB;

namespace Service;


public record PlaceOrderRequest(string BuyerId, string ListingId, int Quantity);
public record OrderResultDto(Order? Order, bool WasFbiRaid, string Message);

/*
 * TODO #24 (Saroj)
 * Interface: IRandomNumberGenerator (new file Service/IRandomNumberGenerator.cs)
 * 1 method: Next(int min, int max) that returns an int, like Random.Next
 * Plus a real class that implements it with Random.
 *
 * Why: the FBI raid uses a random number, and tests can't control a real Random.
 * With an interface, a test can pass a stub that always returns 1 (raid) or 50 (no raid).
 */


public class OrderService
{
    private readonly MyDatabaseConnection _db;

    /*
     * TODO #24 (Saroj)
     * Add a second constructor parameter: IRandomNumberGenerator, and keep it in a field like _db.
     */
    public OrderService(MyDatabaseConnection db)
    {
        _db = db;

    }

    public OrderResultDto PlaceOrder(PlaceOrderRequest dto)
    {
        //Quantity validation
        if (dto.Quantity <= 0)
            throw new Exception("Quantity must be greater than 0");

        // fetch listing
        var listing = _db.Listings.FirstOrDefault(a => a.ListingId == dto.ListingId);
        if (listing == null) throw new Exception("Listing not found.");

        //fetch vendor & check shutdown status
        var vendor = _db.Vendors.FirstOrDefault(v => v.VendorId == listing.VendorId);
        if (vendor == null || vendor.IsShutDown)
            throw new Exception("This vendor is shut down and no longer operational.");

        //stock availability check
        if (listing.StockQuantity < dto.Quantity)
            throw new Exception("Not enough stock available.");


        /*
         * TODO #24 (Saroj)
         * Replace "new Random()" with the IRandomNumberGenerator field from the constructor.
         * The rest of the raid stays the same.
         */
        // 1% Chance FBI Raid
        var random = new Random();
        if (random.Next(1, 101) == 1)
        {
            _db.Vendors
                .Where(v => v.VendorId == vendor.VendorId)
                .Set(v => v.IsShutDown, true)
                .Update();

            _db.Listings
                .Where(a => a.VendorId == vendor.VendorId)
                .Delete();

            return new OrderResultDto(null, true,
                "FBI RAID ! The buyer was an undercover agent. Vendor shut down permanently !");
        }

        /*
         * TODO #22 (Asim)
         * Move the price calculation below into its own small method (see the TODO at the bottom),
         * and call that method here instead.
         */
        // 20% Discount for 10+ previous orders with same vendor

        var priorOrdersCount = _db.Orders.Count(a => a.BuyerId == dto.BuyerId && a.VendorId == vendor.VendorId);
        bool applyDiscount = priorOrdersCount > 10;

        decimal unitPrice = listing.Price;
        decimal rawTotal = unitPrice * dto.Quantity;
        decimal finalPrice = applyDiscount ? rawTotal * 0.80m : rawTotal;

        // Process purchase
        var order = new Order
        {
            BuyerId = dto.BuyerId,
            VendorId = vendor.VendorId,
            ListingId = dto.ListingId,
            Quantity = dto.Quantity,
            TotalPrice = finalPrice,
            IsDiscountApplied = applyDiscount
        };
        _db.Insert(order);

        // Update Stock & Vendor Total Sales
        _db.Listings
            .Where(a => a.ListingId == listing.ListingId)
            .Set(a => a.StockQuantity, a => a.StockQuantity - dto.Quantity)
            .Update();

        /*
         * TODO #23 (Rafal)
         * The brief counts ORDERS, not items. Right now 1 order of 5 items adds 5.
         * Change it so every order adds 1 to TotalSales.
         */
        _db.Vendors
            .Where(v => v.VendorId == vendor.VendorId)
            .Set(v => v.TotalSales, v => v.TotalSales + dto.Quantity)
            .Update();

        string msg = applyDiscount ? "Order placed with 20% loyalty discount!" : "Order placed successfully!";
        return new OrderResultDto(order, false, msg);
    }

    /*
     * TODO #22 (Asim)
     * Method: CalculateTotalPrice (public, so the tests can call it)
     * Takes 3 inputs: unit price (decimal), quantity (int), number of earlier orders
     *                 from this buyer to this vendor (int)
     * Steps: total = price x quantity -> if earlier orders is MORE than 10, take 20% off
     * Returns: the final price (decimal)
     *
     * Why: it's the hard story "after more than 10 orders the next one is 20% cheaper".
     * As its own method it doesn't need the database, so it's easy to test (write the tests first).
     * Test ideas: 10 earlier orders -> full price, 11 -> 20% off, 0 -> full price.
     */








    /*
     * TODO #21 (Saroj)
     * Method: GetOrdersByBuyer
     * Takes 1 input: the buyer's user id (string)
     * Steps: get all orders where BuyerId is that id, newest first
     * Returns: a list of orders (a small response DTO is nicer, e.g. with the listing title)
     *
     * Why: the "My orders" page (#21) shows what the logged-in user bought.
     * Flow: My orders page -> Api.ts -> OrderController (GET) -> this method -> database
     */







}


        
    