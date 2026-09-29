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
}
