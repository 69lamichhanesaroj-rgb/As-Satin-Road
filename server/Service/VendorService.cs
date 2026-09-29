using Infra;
using Infra.Entities;
using LinqToDB;

namespace Service;

    public record CreateVendorRequest(string Name);

    public class VendorService
    {
        private readonly MyDatabaseConnection _db;

        public VendorService(MyDatabaseConnection db)
        {
            _db = db;
        }

        public List<Vendor> GetTopVendors()
        {
            return _db.Vendors
                .Where(v => v.TotalSales >= 100 && !v.IsShutDown)
                .OrderByDescending(v => v.TotalSales)
                .ToList();
        }

        public Vendor CreateVendor(CreateVendorRequest dto)
        {
            var vendor = new Vendor {Name = dto.Name};
            _db.Insert(vendor);
            return vendor;
        }
        
        
        
        
    }
    