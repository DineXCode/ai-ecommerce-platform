using Microsoft.AspNetCore.Mvc;
using ECommerce.Core.Entities;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private static List<Product> products = new List<Product>
    {
        new Product { Id = 1, Name = "Laptop", Price = 50000 },
        new Product { Id = 2, Name = "Phone", Price = 20000 }
    };

    [HttpGet]
    public IActionResult GetProducts()
    {
        return Ok(products);
    }

    [HttpPost]
    public IActionResult AddProduct(Product product)
    {
        products.Add(product);
        return Ok(product);
    }
}