using Infra;
using Infra.Entities;
using LinqToDB;

namespace Service;


public record PlaceOrderRequest(string BuyerId, string ListingId, int Quantity);
public record OrderResultDto(Order? Order, bool WasFbiRaid, string Message);

public class OrderService
{
    private readonly MyDatabaseConnection _db;

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

        _db.Vendors
            .Where(v => v.VendorId == vendor.VendorId)
            .Set(v => v.TotalSales, v => v.TotalSales + dto.Quantity)
            .Update();

        string msg = applyDiscount ? "Order placed with 20% loyalty discount!" : "Order placed successfully!";
        return new OrderResultDto(order, false, msg);
    }
}


        
    