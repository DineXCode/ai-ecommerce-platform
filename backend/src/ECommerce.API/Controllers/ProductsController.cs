using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerce.Infrastructure.Data;
using ECommerce.Core.Entities;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        // POST: api/products
        [HttpPost]
        public async Task<IActionResult> AddProduct([FromBody] Product product)
        {
            if (product == null)
            {
                return BadRequest();
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        // DELETE: api/products/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Product deleted successfully"
            });
        }
        // PATCH: api/products/1/restock
[HttpPatch("{id}/restock")]
public async Task<IActionResult> Restock(int id, [FromBody] int quantity)
{
    var product = await _context.Products.FindAsync(id);

    if (product == null)
        return NotFound();

    if (quantity <= 0)
        return BadRequest("Quantity must be greater than 0.");

    product.StockQuantity += quantity;
    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = $"Stock updated successfully.",
        productId = product.Id,
        newStock = product.StockQuantity
    });
}
        [HttpGet("{id}")]
public async Task<IActionResult> GetProduct(int id)
{
    var product = await _context.Products
        .FirstOrDefaultAsync(x => x.Id == id);

    if(product == null)
        return NotFound();

    return Ok(product);
}
[HttpPut("{id}")]
public async Task<IActionResult> UpdateProduct(
    int id,
    Product updatedProduct)
{
    var product =
        await _context.Products.FindAsync(id);

    if (product == null)
        return NotFound();

    product.Name = updatedProduct.Name;
    product.Description = updatedProduct.Description;
    product.Price = updatedProduct.Price;
    product.Category = updatedProduct.Category;
    product.ImageUrl = updatedProduct.ImageUrl;
    product.StockQuantity = updatedProduct.StockQuantity;
    product.AboutItem = updatedProduct.AboutItem;

    await _context.SaveChangesAsync();

    return Ok(product);
}
    }
}