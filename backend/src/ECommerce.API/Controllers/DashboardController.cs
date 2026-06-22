using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public IActionResult GetDashboard()
    {
        return Ok(new
        {
            TotalUsers = _context.Users.Count(),
            TotalProducts = _context.Products.Count(),
            TotalCartItems = _context.CartItems.Count(),
            TotalWishlistItems = _context.WishlistItems.Count()
        });
    }
    [Authorize(Roles = "Admin")]
    [HttpGet("users")]
    public IActionResult GetUsers()
    {
        return Ok(_context.Users.ToList());
    }

    
    [HttpGet("products")]
    public IActionResult GetProducts()
    {
        return Ok(_context.Products.ToList());
    }

    [HttpGet("cartitems")]
    public IActionResult GetCartItems()
    {
        return Ok(
            _context.CartItems
                .Include(c => c.Product)
                .ToList()
        );
    }

    [HttpGet("wishlist")]
    public IActionResult GetWishlist()
    {
        return Ok(
            _context.WishlistItems
                .Include(w => w.Product)
                .ToList()
        );
    }
}