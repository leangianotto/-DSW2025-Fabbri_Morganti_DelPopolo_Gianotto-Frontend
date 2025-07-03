import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
})
export class UserOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  buscarId: number | null = null;
  pedidoBuscado: any = null;
  errorBusqueda: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.loading = true;
    this.orderService.getUserOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar pedidos del usuario', err);
        this.loading = false;
      },
    });
  }

  buscarPedido() {
    this.pedidoBuscado = null;
    this.errorBusqueda = null;

    if (!this.buscarId) return;

    this.loading = true;
    this.orderService.getOrderById(this.buscarId).subscribe({
      next: (res) => {
        this.pedidoBuscado = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorBusqueda = err.error?.message || 'Pedido no encontrado';
        this.loading = false;
      },
    });
  }

  verTodos() {
    this.pedidoBuscado = null;
    this.errorBusqueda = null;
    this.buscarId = null;
    this.cargarPedidos();
  }
}


