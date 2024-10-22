using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using EcommerceApi.Models;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _productService;

    public ProductsController(ProductService productService)
    {
        _productService = productService;
    }

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetProducts()
    {
        var products = await _productService.GetProductsAsync();
        return Ok(products);
    }

    // GET: api/products/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var products = await _productService.GetProductsAsync();
        var product = products.FirstOrDefault(p => p.Id == id);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    // POST: api/products
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product newProduct)
    {
        var products = await _productService.GetProductsAsync();

        newProduct.Id = products.Max(p => p.Id) + 1;
        products.Add(newProduct);

        await _productService.SaveProductsAsync(products);

        return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, newProduct);
    }

    // PATCH: api/products/{id}
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product updatedProduct)
    {
        var products = await _productService.GetProductsAsync();
        var existingProduct = products.FirstOrDefault(p => p.Id == id);

        if (existingProduct == null)
        {
            return NotFound();
        }

        existingProduct.Name = updatedProduct.Name ?? existingProduct.Name;
        existingProduct.Description = updatedProduct.Description ?? existingProduct.Description;
        existingProduct.Price = updatedProduct.Price != 0 ? updatedProduct.Price : existingProduct.Price;
        existingProduct.Quantity = updatedProduct.Quantity != 0 ? updatedProduct.Quantity : existingProduct.Quantity;
        existingProduct.InventoryStatus = updatedProduct.InventoryStatus ?? existingProduct.InventoryStatus;
        existingProduct.UpdatedAt = updatedProduct.UpdatedAt;

        await _productService.SaveProductsAsync(products);

        return NoContent();
    }

    // DELETE: api/products/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var products = await _productService.GetProductsAsync();
        var product = products.FirstOrDefault(p => p.Id == id);

        if (product == null)
        {
            return NotFound();
        }

        products.Remove(product);

        await _productService.SaveProductsAsync(products);

        return NoContent();
    }
}
