using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECommerce.Infrastructure.Data;
using ECommerce.Core.Entities;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
public async Task<IActionResult> Register(User user)
{
    var existingUser = await _context.Users
        .FirstOrDefaultAsync(x => x.Email == user.Email);

    if (existingUser != null)
    {
        return BadRequest("Email already exists");
    }

    // Every newly registered user becomes a Customer
    user.Role = "Customer";

    _context.Users.Add(user);

    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "Registration successful"
    });
}

        [HttpPost("login")]
        public async Task<IActionResult> Login(User login)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x =>
                    x.Email == login.Email &&
                    x.Password == login.Password);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid Email or Password"
                });
            }

            return Ok(user);
        }
        [HttpPut("make-admin/{email}")]
public async Task<IActionResult> MakeAdmin(string email)
{
    var user = await _context.Users
        .FirstOrDefaultAsync(x => x.Email == email);

    if (user == null)
    {
        return NotFound();
    }

    user.Role = "Admin";

    await _context.SaveChangesAsync();

    return Ok(user);
}
    }
}