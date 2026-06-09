using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerce.Infrastructure.Data;
using ECommerce.Core.Entities;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WishlistController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetWishlist(
            int userId)
        {
            var items = await _context.WishlistItems
                .Where(x => x.UserId == userId)
                .Include(x => x.Product)
                .ToListAsync();

            return Ok(items);
        }

        [HttpPost("{userId}/{productId}")]
        public async Task<IActionResult> AddToWishlist(
            int userId,
            int productId)
        {
            var exists =
                await _context.WishlistItems
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.ProductId == productId);

            if (exists != null)
            {
                return Ok();
            }

            _context.WishlistItems.Add(
                new WishlistItem
                {
                    UserId = userId,
                    ProductId = productId
                });

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveWishlist(
            int id)
        {
            var item =
                await _context.WishlistItems
                .FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            _context.WishlistItems.Remove(item);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}