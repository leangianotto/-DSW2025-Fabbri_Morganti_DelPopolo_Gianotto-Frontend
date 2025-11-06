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
    this.actualizarVista();
  }

  actualizarVista(): void {
    this.cartItems = this.cartService.getCart();
  }

  removeItem(productId: number): void {
    this.cartService.removeProduct(productId);
    this.actualizarVista();
  }

  clearCart(): void {
    const confirmDelete = window.confirm('¿Estás seguro de que querés vaciar el carrito?');
    if (confirmDelete) {
      this.cartService.clearCart();
      this.toast.showToast('Carrito vaciado con éxito', 'info');
      this.actualizarVista();
    }
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
    this.actualizarVista();
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
      next: (res) => {
        this.cartService.clearCart();
        this.actualizarVista();
        this.router.navigate(['/compra-finalizada'], { queryParams: { orderId: res.orderId } });
      },
      error: (err) => {
        console.error('Error al realizar el pedido:', err);
        alert('Hubo un problema al realizar el pedido.');
      },
    });
  }

  /**
   * Pagar con Stripe (redirige a Checkout)
   */
pagarConStripe() {
  const cart = this.cartService.getCart();
  if (!cart.length) {
    alert('El carrito está vacío.');
    return;
  }

  // ⬇️ Tomamos el userId del token (si existe)
  const token = localStorage.getItem('token');
  let userId: number | undefined = undefined;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = Number(payload.id);
    } catch { /* ignore */ }
  }

  const items = cart.map(item => ({
    productId: item.product.id,
    title: item.product.name,
    unit_price: Number(item.product.price), // misma moneda que cobrás en Stripe
    quantity: item.quantity
  }));

  this.orderService.crearCheckout(items, userId).subscribe({
    next: (res) => {
      if (res.url) {
        window.location.href = res.url; // redirige a Stripe
      } else {
        alert('No se pudo iniciar el pago.');
      }
    },
    error: (err) => {
      console.error('Error al crear la sesión de Stripe:', err);
      alert('Error al iniciar el pago.');
    }
  });
}
}