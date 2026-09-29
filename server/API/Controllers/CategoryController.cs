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

    [HttpPost]
    public Category CreateCategory([FromBody] string name)
    {
        return _categoryService.CreateCategory(name);
    }
}