using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerce.Infrastructure.Data;
using ECommerce.Core.Entities;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/cart/1
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            var cartItems = await _context.CartItems
                .Where(c => c.UserId == userId)
                .Include(c => c.Product)
                .ToListAsync();

            return Ok(cartItems);
        }

        // POST: api/cart/1/5
        [HttpPost("{userId}/{productId}")]
        public async Task<IActionResult> AddToCart(
            int userId,
            int productId)
        {
            var product = await _context.Products
                .FindAsync(productId);

            if (product == null)
                return NotFound();

            var item = await _context.CartItems
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.ProductId == productId);

            if (item != null)
            {
                item.Quantity++;
            }
            else
            {
                _context.CartItems.Add(new CartItem
                {
                    UserId = userId,
                    ProductId = productId,
                    Quantity = 1
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Product added to cart"
            });
        }

        // DELETE: api/cart/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var item = await _context.CartItems
                .FindAsync(id);

            if (item == null)
                return NotFound();

            _context.CartItems.Remove(item);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Item removed from cart"
            });
        }
    }
}