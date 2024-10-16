using System.Text.Json;
using EcommerceApi.Models;

public class ProductService
{
    private readonly string _filePath;

    public ProductService(IWebHostEnvironment env)
    {
        // Chemin vers le fichier JSON dans le dossier Data
        _filePath = Path.Combine(env.ContentRootPath, "Data", "products.json");
    }

    // Méthode pour lire les produits depuis le fichier JSON
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



    // Méthode pour sauvegarder les produits dans le fichier JSON
    public async Task SaveProductsAsync(List<Product> products)
    {
        var jsonData = JsonSerializer.Serialize(products, new JsonSerializerOptions { WriteIndented = true });
        await File.WriteAllTextAsync(_filePath, jsonData);
    }
}
