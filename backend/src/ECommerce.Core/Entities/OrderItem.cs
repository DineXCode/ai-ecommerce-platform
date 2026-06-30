namespace ECommerce.Core.Entities;

public class OrderItem
{
    public int Id { get; set; }

    // Foreign Key to Order
    public int OrderId { get; set; }

    public Order? Order { get; set; }

    // Foreign Key to Product
    public int ProductId { get; set; }

    public Product? Product { get; set; }

    // Quantity of this product in the order
    public int Quantity { get; set; }

    // Price of the product at the time of purchase
    public decimal Price { get; set; }

    // Total price for this item
    public decimal TotalPrice => Quantity * Price;
}