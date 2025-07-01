import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ToastService } from 'src/app/services/toast.service';

declare var MercadoPago: any;

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

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;

    const cart = this.cartService.getCart();
    if (cart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const items = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    const totalAmount = this.cartService.getTotal();
    const order = { userId, totalAmount, items };

    this.orderService.createOrder(order).subscribe({
      next: () => {
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

  pagarConMercadoPago() {
    const cart = this.cartService.getCart();

    if (cart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const items = cart.map(item => ({
      title: item.product.name,
      unit_price: Number(item.product.price), 
      quantity: item.quantity
    }));
    

    this.orderService.crearPreferencia(items).subscribe({
      next: (res) => {
        if (res.init_point) {
          window.location.href = res.init_point;
        } else {
          alert('No se pudo iniciar el pago.');
        }
      },
      error: (err) => {
        console.error('Error al crear la preferencia:', err);
        alert('Error al iniciar el pago.');
      }
    });
  }
}
