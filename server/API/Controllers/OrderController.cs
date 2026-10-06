using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrderController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public OrderResultDto PlaceOrder([FromBody] PlaceOrderRequest dto)
    {
        return _orderService.PlaceOrder(dto);
    }

    // GET /api/Order/by-buyer?buyerId=xxx — My orders page calls this
    [HttpGet("by-buyer")]
    public List<OrderService.BuyerOrderDto> GetOrdersByBuyer([FromQuery] string buyerId)
    {
        return _orderService.GetOrdersByBuyer(buyerId);
    }
}