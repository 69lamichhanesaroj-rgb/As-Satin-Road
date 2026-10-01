using Infra;
using Infra.Entities;
using LinqToDB;

namespace Service;

/*
 * TODO #13 (Saroj)
 * This becomes UserService (rename the class and the file).
 * 2 request records here:
 *   RegisterRequest: Username (string), Password (string)
 *   LoginRequest: Username (string), Password (string)
 * The response should never contain the password hash, make a small UserDto (id, name, role).
 */



    public record CreateVendorRequest(string Name);

    public class VendorService
    {
        private readonly MyDatabaseConnection _db;

        public VendorService(MyDatabaseConnection db)
        {
            _db = db;
        }
        
         /// Home page (#18) should show these vendors at the top.
        public bool IsFeatured(int totalSales)
        {
            return totalSales > 100;
        }
        
        public List<Vendor> GetTopVendors()
        {
            return _db.Vendors
                .Where(v => IsFeatured(v.TotalSales) && !v.IsShutDown)
                .OrderByDescending(v => v.TotalSales)
                .ToList();
        }

        public Vendor CreateVendor(CreateVendorRequest dto)
        {
            var vendor = new Vendor {Name = dto.Name};
            _db.Insert(vendor);
            return vendor;
        }

        /*
         * TODO #13 (Saroj)
         * Method: Register (this replaces CreateVendor above)
         * Takes 1 input: a RegisterRequest (username + password)
         * Steps: username and password can't be empty -> username must not exist already
         *        -> hash the password -> save a new user with role "user"
         * Returns: the new user as UserDto (without the hash)
         *
         * Why: the Login page (#13) has a register form.
         * Flow: Login page -> Api.ts -> UserController (POST) -> this method -> database
         */











        /*
         * TODO #13 (Saroj)
         * Method: Login
         * Takes 1 input: a LoginRequest (username + password)
         * Steps: find the user by name -> check the password against the saved hash
         *        -> if wrong or not found, throw "Wrong username or password" (same message for both)
         * Returns: the user as UserDto (id, name, role). The frontend keeps it to know who is logged in.
         *
         * Why: everything else needs to know who the user is (my shop, my orders, admin).
         * Flow: Login page -> Api.ts -> UserController (POST) -> this method -> database
         */










    }
    