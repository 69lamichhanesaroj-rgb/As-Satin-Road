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
        var vendor = _db.Users.FirstOrDefault(v => v.Id == listing.VendorId);
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
            _db.Users
                .Where(v => v.Id == vendor.Id)
                .Set(v => v.IsShutDown, true)
                .Update();

            _db.Listings
                .Where(a => a.VendorId == vendor.Id)
                .Delete();

            return new OrderResultDto(null, true,
                "FBI RAID ! The buyer was an undercover agent. Vendor shut down permanently !");
        }

        // 20% discount after more than 10 earlier orders from the same vendor
        var priorOrdersCount = _db.Orders.Count(a => a.BuyerId == dto.BuyerId && a.VendorId == vendor.Id);
        bool applyDiscount = priorOrdersCount > 10;
        decimal finalPrice = CalculateTotalPrice(listing.Price, dto.Quantity, priorOrdersCount);

        // Process purchase
        var order = new Order
        {
            BuyerId = dto.BuyerId,
            VendorId = vendor.Id,
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
        
        // Increment the vendor's total sales by 1
        _db.Users
            .Where(v => v.Id == vendor.Id)
            .Set(v => v.TotalSales, v => v.TotalSales + 1)
            .Update();

        string msg = applyDiscount ? "Order placed with 20% loyalty discount!" : "Order placed successfully!";
        return new OrderResultDto(order, false, msg);
    }

    // price x quantity, 20% off if the buyer has MORE than 10 earlier orders from this vendor
    // no database here, so the tests can call it directly
    public decimal CalculateTotalPrice(decimal unitPrice, int quantity, int earlierOrders)
    {
        decimal total = unitPrice * quantity;

        if (earlierOrders > 10)
        {
            total = total * 0.80m;
        }

        return total;
    }
    public record BuyerOrderDto(
        string OrderId,
        string ListingId,
        string ListingTitle,
        int Quantity,
        decimal TotalPrice,
        bool IsDiscountApplied,
        DateTime OrderDate);

    public List<BuyerOrderDto> GetOrdersByBuyer(string buyerId)
    {
        var q =
            from o in _db.Orders
            join l in _db.Listings on o.ListingId equals l.ListingId into lj
            from l in lj.DefaultIfEmpty()
            where o.BuyerId == buyerId
            orderby o.OrderDate descending
            select new BuyerOrderDto(
                o.OrderId,
                o.ListingId,
                l != null ? l.Title : "(removed listing)",
                o.Quantity,
                o.TotalPrice,
                o.IsDiscountApplied,
                o.OrderDate);

        return q.ToList();
    }








}


        
    