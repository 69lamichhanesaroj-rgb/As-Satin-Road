using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;


[ApiController]
[Route("[controller]/[action]")]
public class VendorController : ControllerBase
{
    private readonly VendorService _vendorService;
    
    public VendorController(VendorService vendorService)
        {
        _vendorService = vendorService;
        }
    
}