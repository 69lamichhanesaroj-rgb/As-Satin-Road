using Infra;
using Infra.Entities;
using LinqToDB;
using Service.Security;

namespace API;

// "dotnet run -- seed" calls Fill: it deletes everything in the database
// and fills it with demo data, so the app looks good in a demo.
// Every demo account has the same demo password: 12345
public static class DemoData
{
    public static void Fill(MyDatabaseConnection db, IPasswordHasher hasher)
    {
        // delete everything. Orders first, because they point to listings and users
        db.Orders.Delete();
        db.Listings.Delete();
        db.Categories.Delete();
        db.Users.Delete();

        // the admin and the buyers
        AddUser(db, hasher, "asim@gmail.com", "admin", 0);
        // samir and oliver buy and also sell (2 sales each, see the orders below)
        var samir = AddUser(db, hasher, "samir@gmail.com", "user", 2);
        var oliver = AddUser(db, hasher, "oliver", "user", 2);
        var emma = AddUser(db, hasher, "emma", "user", 0);
        var lucas = AddUser(db, hasher, "lucas", "user", 0);

        // the sellers. More than 100 sales = featured seller, so the first two are featured
        var heisenberg = AddUser(db, hasher, "heisenberg", "user", 125);
        var blackbeard = AddUser(db, hasher, "blackbeard", "user", 104);
        var indiana = AddUser(db, hasher, "indiana", "user", 1);
        var gringotts = AddUser(db, hasher, "gringotts", "user", 3);

        var pharmacy = AddCategory(db, "Pharmacy");
        var weaponry = AddCategory(db, "Weaponry");
        var artifacts = AddCategory(db, "Stolen artifacts");
        var documents = AddCategory(db, "Forged documents");
        var pets = AddCategory(db, "Exotic pets");
        var gadgets = AddCategory(db, "Gadgets");

        var candy = AddListing(db, heisenberg, pharmacy, "Blue crystal candy", 49.99m, 108);
        AddListing(db, heisenberg, pharmacy, "Totally legal vitamins", 12.50m, 40);
        var goggles = AddListing(db, heisenberg, gadgets, "Lab goggles, barely used", 19.99m, 25);
        AddListing(db, blackbeard, weaponry, "Cursed pirate cutlass", 320m, 3);
        AddListing(db, blackbeard, weaponry, "Cannon, slightly used", 1200m, 1);
        AddListing(db, blackbeard, documents, "Treasure map (fake)", 35m, 15);
        AddListing(db, indiana, artifacts, "Golden idol (probably real)", 9999m, 1);
        var map = AddListing(db, indiana, artifacts, "Map to the lost city", 75m, 8);
        AddListing(db, indiana, pets, "Baby dragon", 5000m, 2);
        var passport = AddListing(db, gringotts, documents, "Passport, any country", 250m, 24);
        AddListing(db, gringotts, documents, "Diploma from any university", 180m, 30);
        var parrot = AddListing(db, gringotts, pets, "Talking parrot", 450m, 5);
        var pen = AddListing(db, gringotts, gadgets, "Invisible ink pen", 9.99m, 60);
        var rolex = AddListing(db, samir, gadgets, "Fake Rolex, looks real", 89.99m, 12);
        var pills = AddListing(db, samir, pharmacy, "Mystery pills", 15m, 50);
        var stars = AddListing(db, oliver, weaponry, "Ninja throwing stars", 24.99m, 30);
        var scorpion = AddListing(db, oliver, pets, "Pet scorpion", 60m, 4);

        // Samir buys the candy 12 times. The 12th order has 11 earlier ones, so it gets 20% off
        for (int i = 1; i <= 12; i++)
        {
            AddOrder(db, samir, candy, 1, i == 12, 13 - i);
        }
        AddOrder(db, oliver, passport, 1, false, 6);
        AddOrder(db, oliver, map, 1, false, 4);
        AddOrder(db, oliver, parrot, 1, false, 2);
        AddOrder(db, emma, goggles, 2, false, 3);
        AddOrder(db, lucas, pen, 3, false, 1);

        // samir and oliver sell to each other and to the others
        AddOrder(db, emma, rolex, 1, false, 5);
        AddOrder(db, oliver, pills, 2, false, 3);
        AddOrder(db, lucas, stars, 2, false, 2);
        AddOrder(db, samir, scorpion, 1, false, 1);
    }

    static User AddUser(MyDatabaseConnection db, IPasswordHasher hasher, string username, string role, int totalSales)
    {
        var user = new User
        {
            UserName = username,
            PasswordHash = hasher.HashAndSaltPassword("12345"),
            Role = role,
            TotalSales = totalSales
        };
        db.Insert(user);
        return user;
    }

    static int AddCategory(MyDatabaseConnection db, string name)
    {
        return db.InsertWithInt32Identity(new Category { CategoryName = name });
    }

    static Listing AddListing(MyDatabaseConnection db, User seller, int categoryId, string title, decimal price, int stock)
    {
        var listing = new Listing
        {
            VendorId = seller.Id,
            CategoryId = categoryId,
            Title = title,
            Price = price,
            StockQuantity = stock
        };
        db.Insert(listing);
        return listing;
    }

    // the same price rule as OrderService: price x quantity, 20% off when discount is true
    static void AddOrder(MyDatabaseConnection db, User buyer, Listing listing, int quantity, bool discount, int daysAgo)
    {
        decimal total = listing.Price * quantity;
        if (discount)
        {
            total = total * 0.80m;
        }

        db.Insert(new Order
        {
            BuyerId = buyer.Id,
            VendorId = listing.VendorId,
            ListingId = listing.ListingId,
            Quantity = quantity,
            TotalPrice = total,
            IsDiscountApplied = discount,
            OrderDate = DateTime.UtcNow.AddDays(-daysAgo)
        });
    }
}
