using System.Data;
using Infra;
using Infra.Entities;
using LinqToDB;

namespace Service;



public record CreateListingRequest(string VendorId,int CategoryId,string Title, decimal Price, int StockQuantity);


public class ListingService
{
    private readonly MyDatabaseConnection _db;
    
    public  ListingService(MyDatabaseConnection db)
    {
        _db = db;
    }

    public List<Listing> GetActiveListings()
    {
        var activeVendorIds = _db.Vendors.Where(v=> !v.IsShutDown).Select(v => v.VendorId);
        
        return _db.Listings.Where(a => activeVendorIds.Contains(a.VendorId) && a.StockQuantity> 0).ToList();
    }

    
    public Listing CreateListing(CreateListingRequest  dto)
    {
        var vendor = _db.Vendors.FirstOrDefault(v=> v.VendorId == dto.VendorId);
        if (vendor == null)
            throw new Exception("Vendor not found");
        
        if(vendor.IsShutDown)
            throw new Exception("Vendor is shut down");
        
        if(dto.Price <= 0)
            throw new Exception("Price must be greater than zero");

        var listing = new Listing()
        {
            VendorId = vendor.VendorId,
            CategoryId = dto.CategoryId,
            Title = dto.Title,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity
        };
        
        _db.Insert(listing);
        return listing;
    }
    
    
    
    
    
}