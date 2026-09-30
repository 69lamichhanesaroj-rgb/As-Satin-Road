using Infra.Entities;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;


[ApiController]
[Route("api/[controller]/[action]")]
public class ListingController : ControllerBase
{
    private readonly ListingService _listingService;

    public ListingController(ListingService listingService)
    {
        _listingService = listingService;

    }

    [HttpGet]
    public List<Listing> GetActiveListings()
    {
        return _listingService.GetActiveListings();
    }
    
    
    
    [HttpPost]
    public Listing CreateListing([FromBody] CreateListingRequest dto)
    {
        return _listingService.CreateListing(dto);
    }

    /*
     * TODO #17 (Rafal)
     * 3 endpoints, each one just calls the method with the same name in ListingService:
     *   UpdateListing  (HttpPut)    takes an UpdateListingRequest from the body, returns ListingDto
     *   DeleteListing  (HttpDelete) takes the listing id (string), returns nothing
     *   GetMyListings  (HttpGet)    takes the seller's user id (string), returns a list of ListingDto
     * Also change GetActiveListings above to return ListingDto.
     * Why: the Home page (#18) and My shop page (#19) call these through Api.ts.
     */

















}
