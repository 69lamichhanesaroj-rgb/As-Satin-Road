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
    public List<ListingDto> GetActiveListings()
    {
        return _listingService.GetActiveListings();
    }
    
    [HttpPost]
    public ListingDto CreateListing([FromBody] CreateListingRequest dto)
    {
        return _listingService.CreateListing(dto);
    }
    
    [HttpPut]
    public ListingDto UpdateListing([FromBody] UpdateListingRequest dto)
    {
        return _listingService.UpdateListing(dto);
    }

    [HttpDelete]
    public void DeleteListing(string listingId)
    {
        _listingService.DeleteListing(listingId);
    }

    [HttpGet]
    public List<ListingDto> GetMyListings(string vendorId)
    {
        return _listingService.GetMyListings(vendorId);
    }
}
