namespace ECommerce.Core.Entities;

public class ProductRating
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ProductId { get; set; }

    public int Rating { get; set; } // 1-5

    public User? User { get; set; }

    public Product? Product { get; set; }
}