using System.Data;
using Infra;
using Infra.Entities;
using LinqToDB;

namespace Service;



public record CreateListingRequest(string VendorId, int CategoryId,string Title, decimal Price, int StockQuantity);

public record UpdateListingRequest(string ListingId, string Title, decimal Price, int StockQuantity);

/*
 * TODO #17 (Rafal)
 * All listing methods below return ListingDto instead of the Listing entity.
 */
public record ListingDto(string ListingId, string VendorId, int CategoryId, string Title, decimal Price, int StockQuantity, string CategoryName, string VendorName);

public class ListingService
{
    private readonly MyDatabaseConnection _db;
    
    public ListingService(MyDatabaseConnection db)
    {
        _db = db;
    }
    
    private ListingDto ToListingDto(Listing a) => new(
        a.ListingId,
        a.VendorId,
        a.CategoryId,
        a.Title,
        a.Price,
        a.StockQuantity,
        a.Category?.CategoryName ?? "",
        a.Vendor?.Name ?? ""
    );
    
    public List<ListingDto> GetActiveListings()
    {
        var activeVendorIds = _db.Vendors.Where(v=> !v.IsShutDown).Select(v => v.VendorId);

        var listings = _db.Listings.Where(a => activeVendorIds.Contains(a.VendorId) && a.StockQuantity > 0)
            .LoadWith(a => a.Category)
            .LoadWith(a => a.Vendor)
            .ToList();
        
        return listings.Select(ToListingDto).ToList();
    }
    
    public ListingDto CreateListing(CreateListingRequest  dto)
    {
        var vendor = _db.Vendors.FirstOrDefault(v=> v.VendorId == dto.VendorId);
        if (vendor == null)
            throw new Exception("Vendor not found");

        var category = _db.Categories.FirstOrDefault(c => c.CategoryId == dto.CategoryId);
        if (category == null)
            throw new Exception("Category not found");
        
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

        listing.Category = category;
        listing.Vendor = vendor;
        
        return ToListingDto(listing);
    }
    
    public ListingDto UpdateListing(UpdateListingRequest dto)
    {
        var listing = _db.Listings
            .LoadWith(a => a.Category)
            .LoadWith(a => a.Vendor)
            .FirstOrDefault(l => l.ListingId == dto.ListingId);
        if (listing == null)
            throw new Exception("Listing not found");

        if (dto.Price <= 0)
            throw new Exception("Price must be greater than zero");

        if (dto.StockQuantity < 0)
            throw new Exception("Stock quantity can't be negative");

        _db.Listings
            .Where(a => a.ListingId == dto.ListingId)
            .Set(a => a.Title, dto.Title)
            .Set(a => a.Price, dto.Price)
            .Set(a => a.StockQuantity, dto.StockQuantity)
            .Update();

        listing.Title = dto.Title;
        listing.Price = dto.Price;
        listing.StockQuantity = dto.StockQuantity;

        return ToListingDto(listing);
    }
    
    public void DeleteListing(string listingId)
    {
        var listing = _db.Listings.FirstOrDefault(a => a.ListingId == listingId);
        if (listing == null)
            throw new Exception("Listing not found");
        
        _db.Listings.Where(a => a.ListingId == listingId).Delete();
    }
    
    public List<ListingDto> GetMyListings(string vendorId)
    {
        var listings = _db.Listings
            .Where(a => a.VendorId == vendorId)
            .LoadWith(a => a.Category)
            .LoadWith(a => a.Vendor)
            .ToList();
        
        return listings.Select(ToListingDto).ToList();
    }
}