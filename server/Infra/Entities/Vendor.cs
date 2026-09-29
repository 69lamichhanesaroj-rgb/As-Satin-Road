using LinqToDB.Mapping;

namespace Infra.Entities;

[Table("Vendors")]
public class Vendor
{
    [PrimaryKey]
    public string VendorId { get; set; } = Guid.NewGuid().ToString();
    
    [Column, NotNull]
    public string Name { get; set; } = string.Empty;

    [Column] public int TotalSales { get; set; } = 0;


    [Column] public bool IsShutDown { get; set; } = false;

}