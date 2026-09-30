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

    /*
     * TODO #13 (Saroj)
     * This becomes UserController (rename the class and the file).
     * CreateVendor above becomes Register. Add Login next to it:
     *   Register (HttpPost) takes a RegisterRequest, returns UserDto
     *   Login    (HttpPost) takes a LoginRequest, returns UserDto
     * Both just call the method with the same name in UserService.
     * Why: the Login page (#13) calls these through Api.ts.
     */









}