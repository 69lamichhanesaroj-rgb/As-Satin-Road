using Infra.Entities;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;


[ApiController]
[Route("api/[controller]/[action]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    
    public UserController(UserService userService)
        {
        _userService = userService;
        }

    [HttpGet]
    public List<UserDto> GetTopVendors()
    {
        return _userService.GetTopVendors();
    }

    [HttpPost]
    public UserDto Register([FromBody] RegisterRequest dto)
    {
        return _userService.Register(dto);
    }


    [HttpPost]
    public UserDto Login([FromBody] LoginRequest dto)
    {
        return _userService.Login(dto);
    }
}
