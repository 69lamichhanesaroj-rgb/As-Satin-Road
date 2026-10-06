using Infra.Entities;
using LinqToDB;

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

    // runs the real query on a database, so a query linq2db can't turn into SQL fails here
    [Fact]
    public void GetTopVendors_OnlyMoreThan100_NotShutDown()
    {
        using var db = TestDatabase.Create();
        db.Insert(new User { Id = "u1", UserName = "big", TotalSales = 150 });
        db.Insert(new User { Id = "u2", UserName = "exact", TotalSales = 100 });
        db.Insert(new User { Id = "u3", UserName = "raided", TotalSales = 200, IsShutDown = true });
        var service = new UserService(db, null!);

        var top = service.GetTopVendors();

        Assert.Single(top);
        Assert.Equal("big", top[0].Username);
    }
}