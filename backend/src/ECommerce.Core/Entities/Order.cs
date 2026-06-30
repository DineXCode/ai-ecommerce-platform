using System.ComponentModel.DataAnnotations;

namespace ECommerce.Core.Entities;

public class Order
{
    public int Id { get; set; }

    [Required]
    public string OrderNumber { get; set; } = string.Empty;

    public int UserId { get; set; }
    public string PaymentMethod { get; set; } = "";
    public decimal TotalAmount { get; set; }

    public DateTime OrderedAt { get; set; } = DateTime.UtcNow;

    public string Status { get; set; } = "Pending";

    // Navigation Property
    public User? User { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}