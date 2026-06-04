using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommendationsController : ControllerBase
    {
        [HttpGet("{productName}")]
        public IActionResult GetRecommendations(string productName)
        {
            var recommendations = new List<string>();

            switch (productName.ToLower())
            {
                case "laptop":
                    recommendations.AddRange(new[]
                    {
                        "Mouse",
                        "Keyboard",
                        "Laptop Bag"
                    });
                    break;

                case "phone":
                    recommendations.AddRange(new[]
                    {
                        "Charger",
                        "Power Bank",
                        "Earbuds"
                    });
                    break;

                case "sugar":
                    recommendations.AddRange(new[]
                    {
                        "Tea",
                        "Coffee",
                        "Milk"
                    });
                    break;

                default:
                    recommendations.AddRange(new[]
                    {
                        "Popular Product 1",
                        "Popular Product 2"
                    });
                    break;
            }

            return Ok(recommendations);
        }
    }
}