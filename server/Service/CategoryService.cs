using Infra;
using Infra.Entities;
using LinqToDB;

namespace Service;

// what the admin page sends when renaming a category
public record RenameCategoryRequest(int CategoryId, string NewName);

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

    public Category RenameCategory(RenameCategoryRequest dto)
    {
        if (string.IsNullOrWhiteSpace(dto.NewName))
            throw new ArgumentException("Category name cannot be empty.");

        var category = _db.Categories.FirstOrDefault(c => c.CategoryId == dto.CategoryId);
        if (category == null)
            throw new Exception("Category not found");

        _db.Categories
            .Where(c => c.CategoryId == dto.CategoryId)
            .Set(c => c.CategoryName, dto.NewName)
            .Update();

        category.CategoryName = dto.NewName;
        return category;
    }

    // a category that listings still use can't be deleted, they would point to nothing
    public void DeleteCategory(int categoryId)
    {
        var category = _db.Categories.FirstOrDefault(c => c.CategoryId == categoryId);
        if (category == null)
            throw new Exception("Category not found");

        if (_db.Listings.Any(l => l.CategoryId == categoryId))
            throw new Exception("Category is still used by listings");

        _db.Categories.Where(c => c.CategoryId == categoryId).Delete();
    }
}