using LinqToDB.Mapping;

namespace Infra.Entities;

[Table("Categories")]
public class Category
{
    [PrimaryKey,Identity]
    public int CategoryId { get; set; }
    
    [Column, NotNull]
    public string CategoryName { get; set; } = string.Empty;
    
}