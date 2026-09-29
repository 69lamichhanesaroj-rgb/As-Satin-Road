using Infra.Entities;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;


[ApiController]
[Route("api/[controller]/[action]")]
public class VendorController : ControllerBase
{
    private readonly VendorService _vendorService;
    
    public VendorController(VendorService vendorService)
        {
        _vendorService = vendorService;
        }

    [HttpGet]
    public List<Vendor> GetTopVendors()
    {
        return _vendorService.GetTopVendors();
    }

    [HttpPost]
    public Vendor CreateVendor([FromBody] CreateVendorRequest dto)
    {
        return _vendorService.CreateVendor(dto);
    }

}