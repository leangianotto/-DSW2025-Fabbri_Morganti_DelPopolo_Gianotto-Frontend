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
    this.actualizarVista();
  }

  // ===============================
  //   CARGA Y VALIDACIONES
  // ===============================
  actualizarVista(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cartItems = cart;

      // 🔥 ITEMS REMOVIDOS
      const removed: CartItem[] = this.cartService._removedItems || [];
      removed.forEach(r => {
        this.toast.showToast(
          `El producto "${r.product.name}" ya no está disponible y fue eliminado del carrito.`,
          'warning'
        );
      });
      this.cartService._removedItems = [];

      // 🔥 ITEMS AJUSTADOS POR STOCK
      const adjusted = this.cartService._adjustedItems || [];
      adjusted.forEach(a => {
        this.toast.showToast(
          `La cantidad del producto "${a.item.product.name}" fue ajustada de ${a.old} a ${a.new} por falta de stock.`,
          'warning'
        );
      });
      this.cartService._adjustedItems = [];
    });
  }

  // ===============================
  //         ELIMINAR ITEMS
  // ===============================
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

  // ===============================
  //        TOTAL DEL CARRITO
  // ===============================
  getTotal(): number {
    return this.cartService.getTotal();
  }

  // ===============================
  //       ACTUALIZAR CANTIDAD
  // ===============================
  updateQuantity(productId: number, change: number): void {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    this.cartService.updateQuantity(productId, newQuantity);
    this.actualizarVista();
  }

  // ===============================
  //           CHECKOUT
  // ===============================
  checkout() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para realizar un pedido.');
      this.router.navigate(['/login']);
      return;
    }

    // Bloquear checkout si se ajustó o removió algo
    if (this.cartService._removedItems.length > 0 || this.cartService._adjustedItems.length > 0) {
      this.toast.showToast(
        'Se actualizaron productos del carrito. Revisá los cambios antes de continuar.',
        'warning'
      );
      this.actualizarVista();
      return;
    }

    let userId: number;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.id;
    } catch {
      alert('Error al validar sesión.');
      return;
    }

    this.cartService.getCart().subscribe(cart => {
      if (cart.length === 0) {
        alert('El carrito está vacío.');
        return;
      }

      const items = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const totalAmount = this.cartService.getTotal();
      const order = { userId, totalAmount, items };

      this.orderService.createOrder(order).subscribe({
        next: res => {
          this.cartService.clearCart();
          this.actualizarVista();
          this.router.navigate(['/compra-finalizada'], {
            queryParams: { orderId: res.orderId }
          });
        },
        error: err => {
          console.error('Error al realizar el pedido:', err);
          alert('Hubo un problema al realizar el pedido.');
        },
      });
    });
  }

  // ===============================
  //              STRIPE
  // ===============================
  pagarConStripe() {
    this.cartService.getCart().subscribe(cart => {
      
      if (this.cartService._removedItems.length || this.cartService._adjustedItems.length) {
        this.toast.showToast(
          'Se actualizaron productos del carrito. Revisá los cambios antes de pagar.',
          'warning'
        );
        this.actualizarVista();
        return;
      }

      if (cart.length === 0) {
        this.toast.showToast('No hay productos disponibles para pagar.', 'warning');
        return;
      }

      const items = cart.map(item => ({
        productId: item.product.id,
        title: item.product.name,
        unit_price: Number(item.product.price),
        quantity: item.quantity
      }));

      this.orderService.crearCheckout(items).subscribe({
        next: (res: any) => {
          if (res && res.url) {
            window.location.href = res.url;
          } else {
            this.toast.showToast('Error al procesar el pago.', 'warning');
          }
        },
        error: err => {
          console.error('Error al crear la sesión de Stripe:', err);
          this.toast.showToast(
            err?.error?.error || 'Error al crear la sesión de Stripe',
            'warning'
          );
        }
      });
    });
  }
}
