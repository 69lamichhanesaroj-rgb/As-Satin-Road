using LinqToDB.Mapping;

namespace Infra.Entities;

[Table("Users")]
public class User
{
    [PrimaryKey]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Column, NotNull]
    public string UserName { get; set; } = string.Empty;

    [Column, NotNull]
    public string PasswordHash { get; set; } = string.Empty;

    [Column, NotNull]
    public string Role { get; set; } = "user";
    
    
    [Column] public int TotalSales { get; set; } = 0;


    [Column] public bool IsShutDown { get; set; } = false;

}