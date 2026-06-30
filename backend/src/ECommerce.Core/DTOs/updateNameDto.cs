namespace ECommerce.Core.DTOs;

public class UpdateNameDto
{
    public int UserId { get; set; }
    public string NewName { get; set; } = string.Empty;
}