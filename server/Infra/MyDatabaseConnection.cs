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
    /*
     * TODO #13 (Saroj)
     * When Vendor becomes User: change this line to Users (ITable<User>).
     */
    public ITable<User> Users => this.GetTable<User>();
    
    public ITable<Listing> Listings => this.GetTable<Listing>();
    
    public ITable<Order> Orders => this.GetTable<Order>();
    
    
}