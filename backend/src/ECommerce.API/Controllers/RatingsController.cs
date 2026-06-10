using ECommerce.Core.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RatingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RatingsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AddRating(ProductRating rating)
    {
        var existing = await _context.ProductRatings
            .FirstOrDefaultAsync(x =>
                x.UserId == rating.UserId &&
                x.ProductId == rating.ProductId);

        if (existing != null)
        {
            existing.Rating = rating.Rating;
        }
        else
        {
            _context.ProductRatings.Add(rating);
        }

        await _context.SaveChangesAsync();

        var avg = await _context.ProductRatings
            .Where(x => x.ProductId == rating.ProductId)
            .AverageAsync(x => x.Rating);

        var product = await _context.Products
            .FindAsync(rating.ProductId);

        if (product != null)
        {
            product.AverageRating = avg;
            await _context.SaveChangesAsync();
        }

        return Ok();
    }
}