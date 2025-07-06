// compra-finalizada.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-compra-finalizada',
  templateUrl: './compra-finalizada.component.html',
})
export class CompraFinalizadaComponent implements OnInit {
  order: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');

    if (!orderId) {
      this.error = 'ID de pedido no especificado.';
      this.loading = false;
      return;
    }

    this.orderService.getOrderById(+orderId).subscribe({
      next: (res) => {
        this.order = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar el pedido.';
        this.loading = false;
      },
    });
  }

  volverATienda() {
    this.router.navigate(['/products']);
  }
}

