using Infra;
using Infra.Entities;
using LinqToDB;

namespace Service;

/*
 * TODO #15 (Asim)
 * Record: RenameCategoryRequest
 * Holds 2 values: CategoryId (int) and NewName (string)
 *
 * Why: when the admin renames a category, the frontend sends these 2 values together.
 * The controller receives them as this one small object and passes it to RenameCategory below.
 * Look at CreateListingRequest in ListingService.cs, it's the same idea.
 */



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

    /*
     * TODO #15 (Asim)
     * Method: RenameCategory
     * Takes 1 input: a RenameCategoryRequest (the category id + the new name)
     * Steps: check the new name isn't empty -> find the category by its id
     *        -> if it doesn't exist, throw an error "Category not found"
     *        -> save the new name in the database
     * Returns: the updated Category
     *
     * Why: the admin page (#16) has a rename button.
     * Flow: admin page -> Api.ts -> CategoryController (PUT, you add it there too) -> this method -> database
     * Tip: CreateCategory above already checks for an empty name, do it the same way.
     */














    /*
     * TODO #15 (Asim)
     * Method: DeleteCategory
     * Takes 1 input: the category id (int)
     * Steps: find the category -> if it doesn't exist, throw "Category not found"
     *        -> check if any listing still uses this category id
     *        -> if yes, throw an error "Category is still used by listings" (don't delete it)
     *        -> if no, delete it from the database
     * Returns: nothing (void)
     *
     * Why: the admin page (#16) has a delete button.
     * Flow: admin page -> Api.ts -> CategoryController (DELETE, you add it there too) -> this method -> database
     * Why the check: if we deleted a category that listings use, those listings would point to
     * a category that doesn't exist anymore. A clear error is better than broken data.
     */














}