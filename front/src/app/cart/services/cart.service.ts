import { Injectable, signal } from '@angular/core';
import { Product } from '../../products/data-access/product.model';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly _cartItems = signal<CartItem[]>([]);
  public readonly cartItems = this._cartItems.asReadonly();

  addToCart(product: Product, quantity: number = 1) {
    this._cartItems.update(items => {
      const existingItem = items.find(item => item.id === product.id);
      if (existingItem) {
        return items.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...items, { ...product, quantity }];
      }
    });
  }

  removeFromCart(productId: number) {
    this._cartItems.update(items => items.filter(item => item.id !== productId));
  }

  updateQuantity(productId: number, quantity: number) {
    this._cartItems.update(items => 
      items.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  }

  getQuantityInCart(productId: number): number {
    const item = this._cartItems().find(item => item.id === productId);
    return item ? item.quantity : 0;
  }

  clearCart() {
    this._cartItems.set([]);
  }

  getTotal() {
    return this._cartItems().reduce((total, item) => total + item.price * item.quantity, 0);
  }
}