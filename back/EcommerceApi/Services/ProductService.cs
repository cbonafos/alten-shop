using System.Text.Json;
using EcommerceApi.Models;

public class ProductService
{
    private readonly string _filePath;

    public ProductService(IWebHostEnvironment env)
    {
        _filePath = Path.Combine(env.ContentRootPath, "Data", "products.json");
    }

    public async Task<List<Product>> GetProductsAsync()
    {
        try
        {
            if (File.Exists(_filePath))
            {
                using FileStream jsonStream = File.OpenRead(_filePath);
                return await JsonSerializer.DeserializeAsync<List<Product>>(jsonStream);
            }
        }
        catch (Exception ex)
        {
            // Use a proper logging framework here
            Console.WriteLine($"Erreur lors de la désérialisation du fichier JSON : {ex.Message}");
        }
        return new List<Product>();
    }


    public async Task SaveProductsAsync(List<Product> products)
    {
        var jsonData = JsonSerializer.Serialize(products, new JsonSerializerOptions { WriteIndented = true });
        await File.WriteAllTextAsync(_filePath, jsonData);
    }
}
