import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-compra-finalizada',
  templateUrl: './compra-finalizada.component.html',
  styleUrls: ['./compra-finalizada.component.css'],
})
export class CompraFinalizadaComponent implements OnInit {

  private readonly BACKEND_URL = 'http://localhost:3000';

  order: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private orderService: OrderService,
    private cart: CartService,
    private router: Router
  ) {}

  async ngOnInit() {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (!sessionId) {
      this.error = 'No se encontró el identificador de pago.';
      this.loading = false;
      return;
    }

    try {
      const token = localStorage.getItem('token') || '';
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      // 1) Confirmar pago + crear orden en el backend
      const confirm: any = await lastValueFrom(
        this.http.post(
          `${this.BACKEND_URL}/api/checkout/confirm`,
          { sessionId },
          { headers }
        )
      );

      // 2) Si el backend devuelve orderId, traemos la orden para mostrarla
      if (confirm?.orderId) {
        this.order = await lastValueFrom(this.orderService.getOrderById(confirm.orderId));

        const toNum = (v: any) => (v === null || v === undefined || v === '' ? 0 : +v);
        this.order.totalAmount = toNum(this.order.totalAmount);

        if (Array.isArray(this.order.productos)) {
          this.order.productos.forEach((p: any) => {
            p.price = toNum(p.price);
            if (p?.OrderProduct) {
              p.OrderProduct.price_at_purchase = toNum(p.OrderProduct.price_at_purchase);
              p.OrderProduct.quantity = toNum(p.OrderProduct.quantity);
            }
          });
        }
        // opcional para debug:
        // console.log('Orden normalizada:', this.order);
      }

      // 3) Limpiar carrito local
      this.cart.clearCart();
      this.loading = false;
    } catch (e) {
      console.error(e);
      this.error = 'No se pudo confirmar el pago.';
      this.loading = false;
    }
  }

  volverATienda() {
    this.router.navigate(['/products']);
  }
}
