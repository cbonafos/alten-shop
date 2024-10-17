import { Component, inject, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BadgeModule } from "primeng/badge";
import { CartService } from "../services/cart.service";
import { CartItem } from "../services/cart.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-cart-indicator",
  standalone: true,
  imports: [CommonModule, BadgeModule, RouterLink],
  templateUrl: "./cart-indicator.component.html",
  styles: [],
})
export class CartIndicatorComponent {
  private cartService = inject(CartService);

  cartItemCount = computed(() => {
    const items = this.cartService.cartItems();
    return items
      .reduce((total: number, item: CartItem) => total + item.quantity, 0)
      .toString();
  });
}
