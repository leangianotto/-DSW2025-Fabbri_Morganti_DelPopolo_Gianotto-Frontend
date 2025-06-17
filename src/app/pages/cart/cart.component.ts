import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from 'src/app/services/cart.service';
 

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  

  constructor(
    private cartService: CartService,
    
    private router: Router
  ) {}
  

  ngOnInit(): void {
    this.cartItems = this.cartService.getCart();
  }

  removeItem(productId: number): void {
    this.cartService.removeProduct(productId);
    this.cartItems = this.cartService.getCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = this.cartService.getCart();
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
  

  updateQuantity(productId: number, change: number): void {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (!item) return;
  
    const newQuantity = item.quantity + change;
  
    this.cartService.updateQuantity(productId, newQuantity);
    this.cartItems = this.cartService.getCart();
  }

  checkout() {
    const token = localStorage.getItem('token'); // o donde guardes el JWT
  
    if (!token) {
      alert('Debes iniciar sesión para realizar un pedido.');
      this.router.navigate(['/login']); // redirige al login
      return;
    }
  
    
  }
  
  
  
}


