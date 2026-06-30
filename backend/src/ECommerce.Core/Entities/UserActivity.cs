namespace ECommerce.Core.Entities;

public class UserActivity
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ProductId { get; set; }

    public string ActionType { get; set; } = "";

    public DateTime CreatedAt { get; set; }
}