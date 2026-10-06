using System.Data;
using Infra;
using Infra.Entities;
using LinqToDB;

namespace Service;



public record CreateListingRequest(string VendorId,int CategoryId,string Title, decimal Price, int StockQuantity);

/*
 * TODO #17 (Rafal)
 * Record: UpdateListingRequest
 * Holds 4 values: ListingId (string), Title (string), Price (decimal), StockQuantity (int)
 * Why: the "My shop" page sends these when the seller edits a listing or changes the stock.
 */


/*
 * TODO #17 (Rafal)
 * Response DTO: ListingDto (made with Facet from Listing)
 * Same fields as Listing, plus 2 extra: CategoryName (string) and VendorName (string)
 * Why: the frontend wants to show "Weapons" and "BadGuy99", not just ids.
 * All listing methods below return ListingDto instead of the Listing entity.
 */





public class ListingService
{
    private readonly MyDatabaseConnection _db;
    
    public  ListingService(MyDatabaseConnection db)
    {
        _db = db;
    }

    /*
     * TODO #17 (Rafal)
     * Change this one to return ListingDto (with category and seller name) instead of Listing.
     * Home page (#18) uses it.
     */
    public List<Listing> GetActiveListings()
    {
        var activeVendorIds = _db.Users.Where(v => !v.IsShutDown).Select(v => v.Id);
        
        return _db.Listings.Where(a => activeVendorIds.Contains(a.VendorId) && a.StockQuantity> 0).ToList();
    }

    
    public Listing CreateListing(CreateListingRequest  dto)
    {
        var vendor = _db.Users.FirstOrDefault(v=> v.Id == dto.VendorId);
        if (vendor == null)
            throw new Exception("Vendor not found");
        
        if(vendor.IsShutDown)
            throw new Exception("Vendor is shut down");
        
        if(dto.Price <= 0)
            throw new Exception("Price must be greater than zero");

        var listing = new Listing()
        {
            VendorId = vendor.Id,
            CategoryId = dto.CategoryId,
            Title = dto.Title,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity
        };
        
        _db.Insert(listing);
        return listing;
    }

    /*
     * TODO #17 (Rafal)
     * Method: UpdateListing
     * Takes 1 input: an UpdateListingRequest
     * Steps: find the listing by id -> if it doesn't exist, throw "Listing not found"
     *        -> price must be > 0 and stock can't be negative, else throw an error
     *        -> save the new title, price and stock
     * Returns: the updated listing (ListingDto)
     *
     * Why: the seller changes price or stock on the "My shop" page (#19).
     * Flow: My shop page -> Api.ts -> ListingController (PUT) -> this method -> database
     */












    /*
     * TODO #17 (Rafal)
     * Method: DeleteListing
     * Takes 1 input: the listing id (string)
     * Steps: find the listing -> if it doesn't exist, throw "Listing not found" -> delete it
     * Returns: nothing (void)
     *
     * Why: the delete button on the "My shop" page (#19).
     * Flow: My shop page -> Api.ts -> ListingController (DELETE) -> this method -> database
     */







    /*
     * TODO #17 (Rafal)
     * Method: GetMyListings
     * Takes 1 input: the seller's user id (string)
     * Steps: get all listings where VendorId is that id, with category and seller name loaded
     * Returns: a list of ListingDto (also the ones with stock 0, the seller should still see them)
     *
     * Why: the "My shop" page (#19) shows only the logged-in user's own products.
     * Flow: My shop page -> Api.ts -> ListingController (GET) -> this method -> database
     */






}