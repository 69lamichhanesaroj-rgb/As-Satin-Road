using Infra;
using Infra.Entities;
using LinqToDB;

namespace Service.Tests;

// a fresh, empty database for every test, it only lives in memory
// so tests don't mess with each other or with dev.db
public static class TestDatabase
{
    public static MyDatabaseConnection Create()
    {
        var options = new DataOptions().UseSQLite("Data Source=:memory:");
        var db = new MyDatabaseConnection(new DataOptions<MyDatabaseConnection>(options));

        db.CreateTable<Category>();
        db.CreateTable<User>();
        db.CreateTable<Listing>();
        db.CreateTable<Order>();

        return db;
    }
}
