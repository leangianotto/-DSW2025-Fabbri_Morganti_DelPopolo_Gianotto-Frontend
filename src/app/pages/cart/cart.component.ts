import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  // 🔥 MODAL UNIVERSAL
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  actionToConfirm: (() => void) | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.actualizarVista();
  }

  // =========================================================
  //                      MODAL UNIVERSAL
  // =========================================================
  openModal(title: string, message: string, action: () => void) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.actionToConfirm = action;
    this.showModal = true;
  }

  cancelModal() {
    this.showModal = false;
    this.actionToConfirm = null;
  }

  confirmModal() {
    if (this.actionToConfirm) this.actionToConfirm();
    this.cancelModal();
  }

  // =========================================================
  //                   ACTUALIZAR VISTA
  // =========================================================
  actualizarVista(): void {
    this.cartService.getCart().subscribe(cart => {
      this.cartItems = cart;

      // Productos eliminados por falta de stock
      const removed = this.cartService._removedItems || [];
      removed.forEach(r => {
        this.toast.showToast(
          `El producto "${r.product.name}" ya no está disponible y fue eliminado del carrito.`,
          'warning'
        );
      });
      this.cartService._removedItems = [];

      // Productos ajustados
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

  // =========================================================
  //               ELIMINAR ITEM DEL CARRITO
  // =========================================================
  removeItem(productId: number): void {
    this.cartService.removeProduct(productId);
    this.actualizarVista();
  }

  askRemoveItem(productId: number, productName: string) {
    this.openModal(
      'Eliminar producto',
      `¿Seguro que querés eliminar "${productName}" del carrito?"`,
      () => this.removeItem(productId)
    );
  }

  // =========================================================
  //                  VACIAR TODO EL CARRITO
  // =========================================================
  clearCart(): void {
    this.cartService.clearCart();
    this.toast.showToast('Carrito vaciado con éxito', 'info');
    this.actualizarVista();
  }

  askClearCart(): void {
    this.openModal(
      'Vaciar carrito',
      'Esta acción eliminará todos los productos. ¿Estás seguro?',
      () => this.clearCart()
    );
  }

  // =========================================================
  //                       TOTAL
  // =========================================================
  getTotal(): number {
    return this.cartService.getTotal();
  }

  // =========================================================
  //               ACTUALIZAR CANTIDAD
  // =========================================================
  updateQuantity(productId: number, change: number): void {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (!item) return;

    const newQty = item.quantity + change;
    if (newQty < 1) return;

    this.cartService.updateQuantity(productId, newQty);
    this.actualizarVista();
  }

  // =========================================================
  //                        CHECKOUT
  // =========================================================
  checkout() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toast.showToast('Debes iniciar sesión para continuar.', 'warning');
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartService._removedItems.length || this.cartService._adjustedItems.length) {
      this.toast.showToast(
        'El carrito tiene actualizaciones recientes. Revisá los cambios antes de continuar.',
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
      this.toast.showToast('Error al validar la sesión.', 'danger');
      return;
    }

    this.cartService.getCart().subscribe(cart => {
      if (!cart.length) {
        this.toast.showToast('Tu carrito está vacío.', 'warning');
        return;
      }

      const items = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const order = {
        userId,
        totalAmount: this.cartService.getTotal(),
        items
      };

      this.orderService.createOrder(order).subscribe({
        next: res => {
          this.cartService.clearCart();
          this.actualizarVista();
          this.router.navigate(['/compra-finalizada'], {
            queryParams: { orderId: res.orderId }
          });
        },
        error: err => {
          this.toast.showToast(
            err?.error?.error || 'Ocurrió un problema al procesar el pedido.',
            'danger'
          );
        }
      });
    });
  }

  // =========================================================
  //                        STRIPE
  // =========================================================
  pagarConStripe() {
  const token = localStorage.getItem('token');
  if (!token) {
    this.toast.showToast('Debes iniciar sesión para continuar con el pago.', 'warning');
    this.router.navigate(['/login']);
    return;
  }

  this.cartService.getCart().subscribe(cart => {

    if (this.cartService._removedItems.length || this.cartService._adjustedItems.length) {
      this.toast.showToast(
        'Se actualizaron productos del carrito. Revisá los cambios antes de pagar.',
        'warning'
      );
      this.actualizarVista();
      return;
    }

    if (!cart.length) {
      this.toast.showToast('No hay productos en el carrito para pagar.', 'warning');
      return;
    }

    const items = cart.map(item => ({
      productId: item.product.id,
      title: item.product.name,
      unit_price: Number(item.product.price),
      quantity: item.quantity,
    }));

    this.orderService.crearCheckout(items).subscribe({
      next: res => {
        if (res?.url) {
          window.location.href = res.url;
        } else {
          this.toast.showToast('Ocurrió un problema al procesar el pago. Intenta nuevamente.', 'danger');
        }
      },
      error: err => {
        if (err.status === 401) {
          this.toast.showToast('Debes iniciar sesión para continuar con el pago.', 'warning');
          this.router.navigate(['/login']);
        } else {
          this.toast.showToast(
            'Ocurrió un problema al procesar el pago. Intenta nuevamente.',
            'danger'
          );
        }
      }
    });
  });
}

}
