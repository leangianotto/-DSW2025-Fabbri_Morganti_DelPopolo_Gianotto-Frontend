import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';

type FiltroClave = 'id' | 'user' | 'product' | 'dateFrom' | 'dateTo' | 'minTotal' | 'maxTotal' | 'status';
type FiltroActivoClave = 'id' | 'user' | 'product' | 'date' | 'price' | 'status';

type Filtros = Record<FiltroClave, string>;
type FiltrosActivos = Record<FiltroActivoClave, boolean>;


@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
})

export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  expandedOrderId: number | null = null;
  loading = false;
  visibleFiltro: FiltroActivoClave | null = null;

  filtros: Filtros = {
    id: '',
    user: '',
    product: '',
    dateFrom: '',
    dateTo: '',
    minTotal: '',
    maxTotal: '',
    status: ''
  };

  filtrosActivos: FiltrosActivos = {
    id: false,
    user: false,
    product: false,
    date: false,
    price: false,
    status: false
  };

  filtroNombres: { key: FiltroActivoClave; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'user', label: 'Usuario' },
    { key: 'product', label: 'Producto' },
    { key: 'date', label: 'Fecha' },
    { key: 'price', label: 'Precio total' },
    { key: 'status', label: 'Estado' }
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Error al obtener pedidos', err),
    });
  }

  selectOrder(order: any) {
    this.selectedOrder = { ...order };
  }

  cancelEdit() {
    this.selectedOrder = null;
  }

  updateOrder() {
    if (!this.selectedOrder) return;

    this.orderService.updateOrder(this.selectedOrder.id, {
      status: this.selectedOrder.status
    }).subscribe({
      next: () => {
        this.getOrders();
        this.selectedOrder = null;
      },
      error: (err) => console.error('Error al actualizar el pedido', err),
    });
  }

  deleteOrder(id: number) {
    if (confirm('¿Estás seguro de eliminar el pedido?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => this.getOrders(),
        error: (err) => console.error('Error al eliminar', err),
      });
    }
  }

  toggleDetails(orderId: number) {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  updateQuantity(orderId: number, productId: number, quantity: number) {
    this.orderService.updateOrderProductQuantity(orderId, productId, quantity).subscribe({
      next: () => this.getOrders(),
      error: (err) => console.error('Error al actualizar cantidad', err),
    });
  }

  removeProductFromOrder(orderId: number, productId: number) {
    if (confirm('¿Estás seguro de quitar este producto del pedido?')) {
      this.orderService.removeProductFromOrder(orderId, productId).subscribe({
        next: () => this.getOrders(),
        error: (err) => console.error('Error al quitar producto', err),
      });
    }
  }

  calculateTotal(order: any): number {
    if (!order || !order.productos) return 0;
    return order.productos.reduce((acc: number, p: any) => {
      return acc + (p.price * (p.OrderProduct?.quantity || 0));
    }, 0);
  }

  setQuantity(p: any, value: number) {
    if (!p.orderProduct) {
      p.orderProduct = { quantity: value };
    } else {
      p.orderProduct.quantity = value;
    }
  }

  onQuantityChange(orderId: number, productId: number, quantity: number) {
    this.updateQuantity(orderId, productId, quantity);
  }

  buscarConFiltros() {
    const filtrosAplicados: Partial<Filtros> = {};

    if (this.filtrosActivos.user && this.filtros.user) filtrosAplicados.user = this.filtros.user;
    if (this.filtrosActivos.product && this.filtros.product) filtrosAplicados.product = this.filtros.product;

    if (this.filtrosActivos.date) {
      if (this.filtros.dateFrom) filtrosAplicados.dateFrom = this.filtros.dateFrom;
      if (this.filtros.dateTo) filtrosAplicados.dateTo = this.filtros.dateTo;
    }

    if (this.filtrosActivos.price) {
      if (this.filtros.minTotal) filtrosAplicados.minTotal = this.filtros.minTotal;
      if (this.filtros.maxTotal) filtrosAplicados.maxTotal = this.filtros.maxTotal;
    }

    if (this.filtrosActivos.status && this.filtros.status) filtrosAplicados.status = this.filtros.status;

    this.orderService.getAllOrders(filtrosAplicados).subscribe({
      next: (res) => this.orders = res,
      error: (err) => console.error('Error al aplicar filtros', err)
    });
  }

  limpiarFiltros() {
    this.filtros = {
      id: '',
      user: '',
      product: '',
      dateFrom: '',
      dateTo: '',
      minTotal: '',
      maxTotal: '',
      status: ''
    };

    this.filtrosActivos = {
      id: false,
      user: false,
      product: false,
      date: false,
      price: false,
      status: false
    };
    this.getOrders();
  }

  hayFiltrosActivos(): boolean {
    return (Object.keys(this.filtrosActivos) as FiltroActivoClave[]).some((key) => {
      return this.filtrosActivos[key] && this.filtros[key as FiltroClave];
    });
  }

  activarFiltro(filtro: FiltroActivoClave) {
    // Activa/desactiva el checkbox
    this.filtrosActivos[filtro] = !this.filtrosActivos[filtro];
  
    // Si está activado, mostrar ese campo. Si se desactiva, ocultar todo.
    this.visibleFiltro = this.filtrosActivos[filtro] ? filtro : null;
  }
  
}
