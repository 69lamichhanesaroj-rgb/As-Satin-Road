using Infra.Entities;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public CategoryController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }


    [HttpGet]
    public List<Category> GetCategories()
    {
        return _categoryService.GetCategories();    
    }

    /*
     * TODO #14 (Saroj)
     * Only an admin may create, rename or delete categories.
     * In these 3 endpoints: check the logged-in user's role first (how depends on #13),
     * if it's not "admin" -> stop with an error (403 Forbidden). Getting the list stays open for everyone.
     */
    [HttpPost]
    public Category CreateCategory([FromBody] string name)
    {
        return _categoryService.CreateCategory(name);
    }

    /*
     * TODO #15 (Asim)
     * Endpoint: RenameCategory (HttpPut)
     * Takes 1 input from the body: a RenameCategoryRequest
     * Calls: _categoryService.RenameCategory
     * Returns: the updated Category
     * Why: the admin page (#16) calls this through Api.ts when you click rename.
     */





    /*
     * TODO #15 (Asim)
     * Endpoint: DeleteCategory (HttpDelete)
     * Takes 1 input: the category id (int), from the url
     * Calls: _categoryService.DeleteCategory
     * Returns: nothing
     * Why: the admin page (#16) calls this through Api.ts when you click delete.
     */





}