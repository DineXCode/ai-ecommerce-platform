using ECommerce.API.Models;
using ECommerce.Core.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // User: get their own orders
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserOrders(int userId)
    {
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.OrderedAt)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                o.Status,
                o.TotalAmount,
                o.OrderedAt,
                OrderItems = o.OrderItems.Select(oi => new
                {
                    oi.Id,
                    oi.Quantity,
                    oi.Price,
                    Product = new
                    {
                        oi.Product!.Id,
                        oi.Product.Name,
                        oi.Product.ImageUrl,
                        oi.Product.Category
                    }
                })
            })
            .ToListAsync();

        return Ok(orders);
    }

    // Admin: get all orders
    [HttpGet]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.OrderedAt)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                o.Status,
                o.TotalAmount,
                o.OrderedAt,
                User = new
                {
                    o.User!.Id,
                    o.User.Name,
                    o.User.Email
                },
                OrderItems = o.OrderItems.Select(oi => new
                {
                    oi.Id,
                    oi.Quantity,
                    oi.Price,
                    Product = new
                    {
                        oi.Product!.Id,
                        oi.Product.Name,
                        oi.Product.ImageUrl,
                        oi.Product.Category
                    }
                })
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPost]
    public async Task<IActionResult> PlaceOrder(PlaceOrderRequest request)
    {
        var cartItems = await _context.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == request.UserId)
            .ToListAsync();

        if (!cartItems.Any())
            return BadRequest("Cart is empty.");

        foreach (var item in cartItems)
        {
            if (item.Product == null) continue;
            if (item.Product.StockQuantity < item.Quantity)
                return BadRequest(
                    $"{item.Product.Name} only has {item.Product.StockQuantity} item(s) available."
                );
        }

        var order = new Order
        {
            UserId = request.UserId,
            OrderNumber = "ORD-" + DateTime.Now.ToString("yyyyMMddHHmmss"),
            OrderedAt = DateTime.Now,
            Status = "Pending",
            TotalAmount = cartItems.Sum(c => c.Product!.Price * c.Quantity)
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        foreach (var item in cartItems)
        {
            _context.OrderItems.Add(new OrderItem
            {
                OrderId = order.Id,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Price = item.Product!.Price
            });

            item.Product.StockQuantity -= item.Quantity;
        }

        _context.CartItems.RemoveRange(cartItems);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            Message = "Order placed successfully",
            OrderId = order.Id,
            OrderNumber = order.OrderNumber
        });
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();

        order.Status = status;
        await _context.SaveChangesAsync();

        return Ok(order);
    }
}