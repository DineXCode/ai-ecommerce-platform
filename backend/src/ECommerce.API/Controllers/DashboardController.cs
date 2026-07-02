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
    [HttpGet("reports")]
public async Task<IActionResult> GetReports()
{
    var now = DateTime.UtcNow;
    var startOfMonth = new DateTime(now.Year, now.Month, 1);
    var startOfWeek = now.AddDays(-(int)now.DayOfWeek);
    ILogger logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger<DashboardController>();
    logger.LogInformation("Dashboard data retrieved successfully.");
    logger.LogWarning("This is a warning message for demonstration purposes.");
    var allOrders = await _context.Orders
        .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
        .Include(o => o.User)
        .ToListAsync();

    // ── Sales Report ──────────────────────────
    var totalRevenue = allOrders
        .Where(o => o.Status != "Cancelled")
        .Sum(o => o.TotalAmount);

    var monthlyRevenue = allOrders
        .Where(o => o.Status != "Cancelled" &&
                    o.OrderedAt >= startOfMonth)
        .Sum(o => o.TotalAmount);

    var weeklyRevenue = allOrders
        .Where(o => o.Status != "Cancelled" &&
                    o.OrderedAt >= startOfWeek)
        .Sum(o => o.TotalAmount);

    var ordersByStatus = allOrders
        .GroupBy(o => o.Status)
        .Select(g => new { status = g.Key, count = g.Count() })
        .ToList();

    var topProducts = allOrders
        .SelectMany(o => o.OrderItems)
        .GroupBy(oi => new { oi.ProductId, oi.Product!.Name })
        .Select(g => new
        {
            productId = g.Key.ProductId,
            productName = g.Key.Name,
            totalSold = g.Sum(oi => oi.Quantity),
            totalRevenue = g.Sum(oi => oi.Price * oi.Quantity)
        })
        .OrderByDescending(x => x.totalSold)
        .Take(5)
        .ToList();

    var revenueByCategory = allOrders
        .Where(o => o.Status != "Cancelled")
        .SelectMany(o => o.OrderItems)
        .GroupBy(oi => oi.Product!.Category)
        .Select(g => new
        {
            category = g.Key,
            revenue = g.Sum(oi => oi.Price * oi.Quantity),
            unitsSold = g.Sum(oi => oi.Quantity)
        })
        .OrderByDescending(x => x.revenue)
        .ToList();

    // ── Account Report ─────────────────────────
    var allUsers = await _context.Users.ToListAsync();

    var newUsersThisMonth = allUsers
        .Count(u => u.CreatedAt >= startOfMonth);

    var topCustomers = allOrders
        .GroupBy(o => new { o.UserId, o.User!.Name })
        .Select(g => new
        {
            userId = g.Key.UserId,
            name = g.Key.Name,
            totalOrders = g.Count(),
            totalSpent = g.Sum(o => o.TotalAmount)
        })
        .OrderByDescending(x => x.totalSpent)
        .Take(5)
        .ToList();

    return Ok(new
    {
        // Sales
        totalRevenue,
        monthlyRevenue,
        weeklyRevenue,
        totalOrders = allOrders.Count,
        ordersByStatus,
        topProducts,
        revenueByCategory,

        // Accounts
        totalUsers = allUsers.Count,
        newUsersThisMonth,
        topCustomers
    });
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