import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, CartService } from '../services/cart.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: "./cart-details.component.html",
  styles: []
})

export class CartDetailsComponent {
    private cartService = inject(CartService);
  
    cartItems = this.cartService.cartItems;
  
    total = computed(() => {
      return this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
    });
  
    decreaseQuantity(item: CartItem) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
    }
  
    increaseQuantity(item: CartItem) {
      this.cartService.updateQuantity(item.id, item.quantity + 1);
    }
  
    removeItem(item: CartItem) {
      this.cartService.removeFromCart(item.id);
    }
  }