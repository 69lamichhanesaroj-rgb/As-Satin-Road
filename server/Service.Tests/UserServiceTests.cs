namespace Service.Tests;

public class UserServiceTests
{
    [Fact]
    public void IsFeatured_Exactly100_ReturnsFalse()
    {
        var service = new UserService(null!, null!);
        Assert.False(service.IsFeatured(100));
    }

    [Fact]
    public void IsFeatured_LessThan100_ReturnsFalse()
    {
        var service = new UserService(null!, null!);
        Assert.False(service.IsFeatured(0));
    }

    [Fact]
    public void IsFeatured_MoreThan100_ReturnsTrue()
    {
        var service = new UserService(null!, null!);
        Assert.True(service.IsFeatured(101));
    }
}