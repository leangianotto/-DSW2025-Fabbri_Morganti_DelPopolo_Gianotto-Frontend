import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';

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
  topSellingProducts: { product: any; totalVendidas: string }[] = [];
  mostrarTopVendidos = false;

  // MODAL UNIVERSAL
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalConfirmCallback: (() => void) | null = null;

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

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    public toast: ToastService // <-- público para usar en el template
  ) {}

  ngOnInit() {
    this.getOrders();
    this.loadTopSellingProducts();
  }

  /** CARGAR PEDIDOS */
  getOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => this.orders = data,
      error: () => this.toast.showToast('Error al obtener pedidos', 'danger')
    });
  }

  /** SELECCIONAR PEDIDO PARA EDICIÓN */
  selectOrder(order: any) {
    this.selectedOrder = { ...order };
  }

  cancelEdit() {
    this.selectedOrder = null;
  }

  /** ACTUALIZAR ESTADO DEL PEDIDO */
  updateOrder() {
    if (!this.selectedOrder) return;

    this.orderService.updateOrder(this.selectedOrder.id, { status: this.selectedOrder.status }).subscribe({
      next: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.toast.showToast('Pedido actualizado correctamente', 'success');
        this.getOrders();
        this.selectedOrder = null;
      },
      error: () => this.toast.showToast('Error al actualizar el pedido', 'danger')
    });
  }

  /** ELIMINAR PEDIDO CON MODAL */
  askDeleteOrder(id: number) {
    this.modalTitle = 'Eliminar pedido';
    this.modalMessage = '¿Estás seguro de eliminar este pedido?';
    this.modalConfirmCallback = () => this.deleteOrder(id);
    this.showModal = true;
  }

  deleteOrder(id: number) {
    this.showModal = false;
    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.toast.showToast('Pedido eliminado correctamente', 'success'); // solo 1 toast
        this.getOrders();
      },
      error: () => this.toast.showToast('Error al eliminar pedido', 'danger')
    });
  }

  toggleDetails(orderId: number) {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  updateQuantity(orderId: number, productId: number, quantity: number) {
    this.orderService.updateOrderProductQuantity(orderId, productId, quantity).subscribe({
      next: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.toast.showToast('Cantidad actualizada', 'success'); // solo 1 toast
        this.getOrders();
      },
      error: () => this.toast.showToast('Error al actualizar cantidad', 'danger')
    });
  }

  /** QUITAR PRODUCTO DEL PEDIDO CON MODAL */
  askRemoveProduct(orderId: number, productId: number) {
    this.modalTitle = 'Quitar producto';
    this.modalMessage = '¿Estás seguro de quitar este producto del pedido?';
    this.modalConfirmCallback = () => this.removeProductFromOrder(orderId, productId);
    this.showModal = true;
  }

  removeProductFromOrder(orderId: number, productId: number) {
    this.showModal = false;
    this.orderService.removeProductFromOrder(orderId, productId).subscribe({
      next: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.toast.showToast('Producto removido del pedido', 'success'); // solo 1 toast
        this.getOrders();
      },
      error: () => this.toast.showToast('Error al quitar producto', 'danger')
    });
  }

  /** TOTAL DEL PEDIDO */
  calculateTotal(order: any): number {
    if (!order || !order.productos) return 0;
    return order.productos.reduce((acc: number, p: any) => acc + (p.price * (p.OrderProduct?.quantity || 0)), 0);
  }

  /** FILTROS */
  buscarConFiltros() {
    const filtrosAplicados: Partial<Filtros> = {};

    if (this.filtrosActivos.id && this.filtros.id) filtrosAplicados.id = this.filtros.id;
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
      error: () => this.toast.showToast('Error al aplicar filtros', 'danger')
    });
  }

  limpiarFiltros() {
    this.filtros = { id: '', user: '', product: '', dateFrom: '', dateTo: '', minTotal: '', maxTotal: '', status: '' };
    this.filtrosActivos = { id: false, user: false, product: false, date: false, price: false, status: false };
    this.getOrders();
  }

  hayFiltrosActivos(): boolean {
    return (Object.keys(this.filtrosActivos) as FiltroActivoClave[]).some(key => this.filtrosActivos[key] && this.filtros[key as FiltroClave]);
  }

  activarFiltro(filtro: FiltroActivoClave) {
    this.filtrosActivos[filtro] = !this.filtrosActivos[filtro];
    this.visibleFiltro = this.filtrosActivos[filtro] ? filtro : null;
  }

  loadTopSellingProducts() {
    this.productService.getTopSellingProducts().subscribe({
      next: (data) => {
        this.topSellingProducts = data.filter(item => item.Product).map(item => ({
          product: { ...item.Product, image: item.Product.imageUrl || 'default.jpg' },
          totalVendidas: item.totalVendidas
        }));
      },
      error: () => this.toast.showToast('Error al cargar productos más vendidos', 'danger')
    });
  }

  toggleTopVendidos() {
    this.mostrarTopVendidos = !this.mostrarTopVendidos;
  }

  /** MODAL UNIVERSAL */
  confirmModal() {
    if (this.modalConfirmCallback) this.modalConfirmCallback();
  }

  cancelModal() {
    this.showModal = false;
  }
}
