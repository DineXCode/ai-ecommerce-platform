using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ECommerce.Core.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ECommerce.Core.DTOs;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration; // ✅ was used but never injected

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // -------------------------------------------------------------------------
    // POST api/auth/register
    // -------------------------------------------------------------------------
    [HttpPost("register")]
    public async Task<IActionResult> Register(User user)
    {
        bool emailTaken = await _context.Users
            .AnyAsync(x => x.Email == user.Email);

        if (emailTaken)
            return BadRequest("Email already exists.");

        user.Role = "Customer";
        // ⚠️  Hash the password before saving (e.g. BCrypt.HashPassword)

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registration successful." });
    }

    // -------------------------------------------------------------------------
    // POST api/auth/login
    // -------------------------------------------------------------------------
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto) // ✅ made async
    {
        // ⚠️  Compare against a hashed password in production
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Password == dto.Password);

        if (user is null)
            return Unauthorized("Invalid credentials.");

        string token = GenerateJwtToken(user);

        return Ok(new
        {
            token,
            role   = user.Role,
            userId = user.Id,
            name   = user.Name
        });
    }

    // -------------------------------------------------------------------------
    // PUT api/auth/make-admin/{email}   — Admin only ✅ was unauthenticated
    // -------------------------------------------------------------------------
    [Authorize(Roles = "Admin")]
    [HttpPut("make-admin/{email}")]
    public async Task<IActionResult> MakeAdmin(string email)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);

        if (user is null)
            return NotFound();

        user.Role = "Admin";
        await _context.SaveChangesAsync();

        return Ok(user);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------
    private string GenerateJwtToken(User user)
    {
        Claim[] claims =
        [
            new(ClaimTypes.Name,  user.Name),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role,  user.Role)
        ];

        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer:             _configuration["Jwt:Issuer"],
            audience:           _configuration["Jwt:Audience"],
            claims:             claims,
            expires:            DateTime.UtcNow.AddHours(12), // ✅ UtcNow is safer than Now
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}