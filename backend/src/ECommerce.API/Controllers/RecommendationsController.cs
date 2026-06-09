using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommendationsController : ControllerBase
    {
        [HttpGet("{productName}")]
        public IActionResult GetRecommendations(string productName)
        {
            try
            {
                var filePath =
                    @"C:\Users\dineb\ai-ecommerce-platform\database\ProductRecommendations.xlsx";

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound(new
                    {
                        Message = "Excel file not found",
                        FilePath = filePath
                    });
                }

                ExcelPackage.License.SetNonCommercialPersonal("Dine");

                using var package =
                    new ExcelPackage(new FileInfo(filePath));

                if (package.Workbook.Worksheets.Count == 0)
                {
                    return BadRequest(new
                    {
                        Message = "No worksheets found in Excel file"
                    });
                }

                var worksheet =
                    package.Workbook.Worksheets[0];

                var recommendations =
                    new List<string>();

                int rowCount =
                    worksheet.Dimension.Rows;

                for (int row = 2; row <= rowCount; row++)
                {
                    string product =
                        worksheet.Cells[row, 1].Text;

                    if (product.Equals(
                        productName,
                        StringComparison.OrdinalIgnoreCase))
                    {
                        string recommendedProducts =
                            worksheet.Cells[row, 2].Text;

                        recommendations =
                            recommendedProducts
                            .Split(',')
                            .Select(x => x.Trim())
                            .ToList();

                        break;
                    }
                }

                return Ok(recommendations);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Error = ex.Message
                });
            }
        }
    }
}