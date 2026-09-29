using Infra;
using Infra.Entities;
using LinqToDB;

namespace Service;

public class CategoryService
{
    private readonly MyDatabaseConnection _db;
    public CategoryService(MyDatabaseConnection db)
    {
        _db = db;
    }

    public List<Category> GetCategories()
    {
        return _db.Categories.ToList();
    }

    public Category CreateCategory(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Category name cannot be empty.");

        var id = _db.InsertWithInt32Identity(new Category { CategoryName = name });
        return new Category { CategoryId = id, CategoryName = name };
    }
}