namespace Service.Tests;

public class VendorServiceTests
{
    [Fact]
    public void IsFeatured_Exactly100_ReturnsFalse()
    {
        var service = new VendorService(null!);
        Assert.False(service.IsFeatured(100));
    }

    [Fact]
    public void IsFeatured_LessThan100_ReturnsFalse()
    {
        var service = new VendorService(null!);
        Assert.False(service.IsFeatured(0));
    }

    [Fact]
    public void IsFeatured_MoreThan100_ReturnsTrue()
    {
        var service = new VendorService(null!);
        Assert.True(service.IsFeatured(101));
    }
}