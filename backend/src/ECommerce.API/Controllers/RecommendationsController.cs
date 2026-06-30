using Microsoft.AspNetCore.Mvc;
using ECommerce.Infrastructure.Data;
using ECommerce.Core.Entities;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/recommendations")]
public class RecommendationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RecommendationsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
public IActionResult GetRecommendations(int userId)
{
    // Use only the LAST action to determine category
    var lastActivity = _context.UserActivities
        .Where(x => x.UserId == userId)
        .OrderByDescending(x => x.CreatedAt)
        .Join(_context.Products,
            a => a.ProductId,
            p => p.Id,
            (a, p) => new { a.UserId, p.Category })
        .FirstOrDefault();

    if (lastActivity == null)
        return Ok(new List<object>());

    var favoriteCategory = lastActivity.Category;

    var interactedProductIds = _context.UserActivities
        .Where(x => x.UserId == userId)
        .Select(x => x.ProductId)
        .Distinct()
        .ToList();

    var recommendations = _context.Products
        .Where(p =>
            p.Category == favoriteCategory &&
            p.IsActive &&
            p.StockQuantity > 0)
        .OrderByDescending(p => p.AverageRating)
        .Take(4)
        .Select(p => new
        {
            p.Id,
            p.Name,
            p.Price,
            p.Category,
            p.ImageUrl,
            p.AverageRating,
            p.StockQuantity
        })
        .ToList();

    if (recommendations.Count < 4)
    {
        var fillProducts = _context.Products
            .Where(p =>
                p.Category != favoriteCategory &&
                p.IsActive &&
                p.StockQuantity > 0 &&
                !interactedProductIds.Contains(p.Id))
            .OrderByDescending(p => p.AverageRating)
            .Take(4 - recommendations.Count)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                p.Category,
                p.ImageUrl,
                p.AverageRating,
                p.StockQuantity
            })
            .ToList();

        recommendations = recommendations.Concat(fillProducts).ToList();
    }

    return Ok(recommendations);
} // ← GetRecommendations ends here

    [HttpGet("debug/{userId}")]
    public IActionResult Debug(int userId)
    {
        var activities = _context.UserActivities
            .Where(x => x.UserId == userId)
            .ToList();

        var interactedIds = activities
            .Select(x => x.ProductId)
            .Distinct()
            .ToList();

        var favoriteCategory = _context.UserActivities
            .Join(_context.Products,
                a => a.ProductId,
                p => p.Id,
                (a, p) => new { a.UserId, p.Category })
            .Where(x => x.UserId == userId)
            .GroupBy(x => x.Category)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .FirstOrDefault();

        var allInCategory = _context.Products
            .Where(p => p.Category == favoriteCategory)
            .Select(p => new { p.Id, p.Name, p.Category, p.IsActive, p.StockQuantity })
            .ToList();

        return Ok(new
        {
            favoriteCategory,
            interactedProductIds = interactedIds,
            allProductsInCategory = allInCategory,
            availableAfterExclusion = allInCategory
                .Where(p => !interactedIds.Contains(p.Id))
                .ToList()
        });
    }  // ← Debug ends here

}  // ← class ends here