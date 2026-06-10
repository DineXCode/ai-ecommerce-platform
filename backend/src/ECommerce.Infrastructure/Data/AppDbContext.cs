using Microsoft.EntityFrameworkCore;
using ECommerce.Core.Entities;

namespace ECommerce.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }

    public DbSet<CartItem> CartItems { get; set; }

    public DbSet<User> Users { get; set; }

    public DbSet<WishlistItem> WishlistItems { get; set; }

    public DbSet<ProductRating> ProductRatings { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Product>()
        .Property(p => p.Price)
        .HasPrecision(18, 2);

    base.OnModelCreating(modelBuilder);
}
}