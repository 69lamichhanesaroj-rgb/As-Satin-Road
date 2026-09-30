using LinqToDB.Mapping;

namespace Infra.Entities;

/*
 * TODO #13 (Saroj)
 * Turn Vendor into User (rename the class, the file and the table to User / Users).
 * In the brief every user can buy AND sell, so one table is enough.
 * Keep: the id, Name (use it as the username), TotalSales, IsShutDown
 * Add 2 columns: PasswordHash (string) and Role (string, "admin" or "user")
 *
 * Why: orders and listings then point to real users, not free text.
 * Never save the plain password, only the hash (see UserService).
 * After renaming, Rider shows every place that used Vendor, fix those too.
 */


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