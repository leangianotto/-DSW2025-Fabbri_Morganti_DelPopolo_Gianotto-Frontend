import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private toast: ToastService,
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
    return this.cartService.getTotal();
  }

  updateQuantity(productId: number, change: number): void {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    this.cartService.updateQuantity(productId, newQuantity);
    this.cartItems = this.cartService.getCart();
  }

  checkout() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('Debes iniciar sesión para realizar un pedido.');
      this.router.navigate(['/login']);
      return;
    }
  
    const items = this.cartService.getCart();
    this.orderService.createOrder(items).subscribe({
      next: (res) => {
        alert('Pedido realizado con éxito');
        this.cartService.clearCart();
        this.cartItems = [];
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error al realizar el pedido:', err);
        alert('Hubo un problema al realizar el pedido.');
      },
    });
  }
  
  
}
