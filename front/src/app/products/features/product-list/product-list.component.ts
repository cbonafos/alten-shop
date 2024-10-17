import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { CartService } from "../../../cart/services/cart.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [
    DataViewModule,
    CardModule,
    ButtonModule,
    DialogModule,
    ProductFormComponent,
    RatingModule,
    FormsModule,
    TagModule,
    CommonModule,
    InputTextModule,
    DropdownModule
  ],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);

  public products: Product[] = [];
  public filteredProducts: Product[] = [];
  public categories: string[] = [];

  public isDialogVisible = false;
  public isCreation = false;
  public editedProduct: Product = { ...emptyProduct };

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.get().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.updateCategories();
      },
      error: (err) => console.error('Erreur lors du chargement des produits:', err)
    });
  }

  updateCategories() {
    this.categories = ['Toutes', ...new Set(this.products.map(product => product.category))];
  }

  onCategoryChange(event: any) {
    const category = event.value;
    if (category === 'Toutes') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product => product.category === category);
    }
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct = { ...emptyProduct };
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct = { ...product };
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe(() => {
      this.loadProducts();
    });
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe(() => {
        this.loadProducts();
      });
    } else {
      this.productsService.update(product).subscribe(() => {
        this.loadProducts();
      });
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  public getStatusInfo(product: Product): { severity: any, text: string } {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return { severity: 'success', text: 'In Stock' };
      case 'LOWSTOCK':
        return { severity: 'warning', text: 'Low Stock' };
      case 'OUTOFSTOCK':
        return { severity: 'danger', text: 'Out of Stock' };
      default:
        return { severity: 'info', text: 'Out of Stock' };
    }
  }

  public getSeverity(product: Product): any {
    return this.getStatusInfo(product).severity;
  }

  public getStockStatusText(product: Product): string {
    return this.getStatusInfo(product).text;
  }

  public addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}