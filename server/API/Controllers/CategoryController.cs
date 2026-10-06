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
     */using Infra.Entities;
    using Microsoft.AspNetCore.Mvc;
    using Service;

    namespace API.Controllers;

    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;
        private readonly UserService _userService;

        public CategoryController(CategoryService categoryService, UserService userService)
        {
            _categoryService = categoryService;
            _userService = userService;
        }

        [HttpGet]
        public List<Category> GetCategories()
        {
            return _categoryService.GetCategories();
        }

        [HttpPost]
        public Category CreateCategory([FromBody] string name, [FromQuery] string userId)
        {
            RequireAdmin(userId);
            return _categoryService.CreateCategory(name);
        }

        [HttpPut]
        public Category RenameCategory([FromBody] RenameCategoryRequest dto, [FromQuery] string userId)
        {
            RequireAdmin(userId);
            return _categoryService.RenameCategory(dto);
        }

        [HttpDelete]
        public void DeleteCategory([FromQuery] int categoryId, [FromQuery] string userId)
        {
            RequireAdmin(userId);
            _categoryService.DeleteCategory(categoryId);
        }

        private void RequireAdmin(string? userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ForbiddenException("Admins only");

            var caller = _userService.GetById(userId);
            if (caller == null || caller.Role != "admin")
                throw new ForbiddenException("Admins only");
        }
    }

    [HttpPost]
    public Category CreateCategory([FromBody] string name)
    {
        return _categoryService.CreateCategory(name);
    }

    [HttpPut]
    public Category RenameCategory([FromBody] RenameCategoryRequest dto)
    {
        return _categoryService.RenameCategory(dto);
    }

    [HttpDelete]
    public void DeleteCategory(int categoryId)
    {
        _categoryService.DeleteCategory(categoryId);
    }
}