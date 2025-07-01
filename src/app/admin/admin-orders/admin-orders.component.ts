import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
})
export class AdminOrdersComponent implements OnInit {

  orders: any[] = [];
  selectedOrder: any = null;
  expandedOrderId: number | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        
        this.orders = data;
      },
      error: (err) => console.error('Error al obtener pedidos', err),
    });
  }
  

  selectOrder(order: any) {
    this.selectedOrder = { ...order }; // clonamos para no mutar directamente el objeto original
  }

  cancelEdit() {
    this.selectedOrder = null;
  }

  updateOrder() {
    if (!this.selectedOrder) return;

    this.orderService.updateOrder(this.selectedOrder.id, { status: this.selectedOrder.status }).subscribe({
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
  
  
  
  
  
  
  
}
