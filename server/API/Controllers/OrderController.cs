using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly OrderService _orderService;
    
    public  OrderController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public OrderResultDto PlaceOrder([FromBody] PlaceOrderRequest dto)
    {
        return _orderService.PlaceOrder(dto);
    }

    /*
     * TODO #21 (Saroj)
     * Endpoint: GetOrdersByBuyer (HttpGet)
     * Takes 1 input: the buyer's user id (string)
     * Calls: _orderService.GetOrdersByBuyer
     * Returns: the list of orders
     * Why: the My orders page (#21) calls this through Api.ts.
     */





}