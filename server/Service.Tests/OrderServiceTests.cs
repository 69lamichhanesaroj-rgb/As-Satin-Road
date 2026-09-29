using Service;

public class OrderServiceTests
{
    [Fact]
    public void PlaceOrder_ZeroQuantity()
    {
        var service = new OrderService(null!);
        var dto = new PlaceOrderRequest("buyer1","listing1", 0);
        
        var warning = Assert.Throws<Exception>(() => service.PlaceOrder(dto));
        Assert.Equal("Quantity must be greater than 0", warning.Message);
    }

    [Fact]
    public void PlaceOrder_NegativeQuantity()
    {
        var service = new OrderService(null!);
        var dto = new PlaceOrderRequest("buyer1","listing1", -1);
        var warning = Assert.Throws<Exception>(() => service.PlaceOrder(dto));
        Assert.Equal("Quantity must be greater than 0", warning.Message);
    }
}