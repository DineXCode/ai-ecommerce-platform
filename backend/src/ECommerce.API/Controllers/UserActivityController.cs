using Microsoft.AspNetCore.Mvc;
using ECommerce.Infrastructure.Data;
using ECommerce.Core.Entities;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/activity")]
public class UserActivityController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserActivityController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Track(UserActivity activity)
    {
        activity.CreatedAt = DateTime.UtcNow;

        _context.UserActivities.Add(activity);

        await _context.SaveChangesAsync();

        return Ok();
    }
}