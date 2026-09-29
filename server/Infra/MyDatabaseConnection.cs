using Infra.Entities;
using LinqToDB;
using LinqToDB.Data;

namespace Infra;

public class MyDatabaseConnection : DataConnection
{
    public MyDatabaseConnection(DataOptions<MyDatabaseConnection> options)
        : base(options.Options)
    {
        
    }
    
    public ITable<Category> Categories => this.GetTable<Category>();
    public ITable<Vendor> Vendors => this.GetTable<Vendor>();
    
    public ITable<Listing> Listings => this.GetTable<Listing>();
    
    public ITable<Order> Orders => this.GetTable<Order>();
    
    
}