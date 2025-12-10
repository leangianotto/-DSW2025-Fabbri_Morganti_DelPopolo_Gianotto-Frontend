import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserOrdersComponent } from './user-orders.component';
import { FormsModule } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';


describe('UserOrdersComponent', () => {
  let component: UserOrdersComponent;
  let fixture: ComponentFixture<UserOrdersComponent>;
  let orderService: OrderService;
  let httpMock: HttpTestingController;

  const mockOrders = [
    {
      id: 1,
      userId: 1,
      totalAmount: 100.50,
      status: 'completed',
      createdAt: '2025-12-01',
    },
    {
      id: 2,
      userId: 1,
      totalAmount: 250.75,
      status: 'pending',
      createdAt: '2025-12-05',
    },
  ];

  const mockOrder = {
    id: 1,
    userId: 1,
    totalAmount: 100.50,
    status: 'completed',
    createdAt: '2025-12-01',
    items: [
      {
        productId: 10,
        quantity: 2,
        productName: 'Product A',
        price: 50.25,
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserOrdersComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [OrderService],
    });

    fixture = TestBed.createComponent(UserOrdersComponent);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Integración: Carga de pedidos del usuario', () => {
    it('should load user orders on init', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/my-orders');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBe(true);

      req.flush(mockOrders);

      expect(component.orders).toEqual(mockOrders);
      expect(component.loading).toBe(false);
    });

    it('should set loading to true while fetching orders', (done) => {
      fixture.detectChanges();

      expect(component.loading).toBe(true);

      const req = httpMock.expectOne('http://localhost:3000/api/orders/my-orders');
      req.flush(mockOrders);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.loading).toBe(false);
        done();
      });
    });

    it('should handle error when loading user orders', () => {
      jest.spyOn(console, 'error').mockImplementation(); //Oculta errores por usar mocks TEST SI FUNCIONA
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/my-orders');
      req.error(new ErrorEvent('Network error'), { status: 500, statusText: 'Internal Server Error' });

      expect(component.loading).toBe(false);
      expect(component.orders.length).toBe(0);
    });
  });

  describe('Integración: Búsqueda de pedido por ID', () => {
    it('should search for order by id and display it', () => {
      component.buscarId = 1;
      component.buscarPedido();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/1');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBe(true);

      req.flush(mockOrder);

      expect(component.pedidoBuscado).toEqual(mockOrder);
      expect(component.loading).toBe(false);
      expect(component.errorBusqueda).toBeNull();
    });

    it('should handle error when searching for order by id', () => {
      component.buscarId = 999;
      component.buscarPedido();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/999');
      req.error(
        new ErrorEvent('Not Found'),
        { status: 404, statusText: 'Not Found' }
      );

      expect(component.pedidoBuscado).toBeNull();
      expect(component.errorBusqueda).toBeTruthy();
      expect(component.loading).toBe(false);
    });

    it('should handle custom error message from server', () => {
      component.buscarId = 999;
      component.buscarPedido();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/999');
      req.flush(
        { message: 'Este pedido no existe en nuestro sistema' },
        { status: 404, statusText: 'Not Found' }
      );

      expect(component.errorBusqueda).toBeTruthy();
      expect(component.loading).toBe(false);
    });

    it('should not search if buscarId is null', () => {
      component.buscarId = null;
      component.buscarPedido();

      httpMock.expectNone('http://localhost:3000/api/orders/null');
    });

    it('should reset search state when buscarPedido is called', () => {
      component.pedidoBuscado = { id: 1 };
      component.errorBusqueda = 'Some error';

      component.buscarId = 2;
      component.buscarPedido();

      expect(component.pedidoBuscado).toBeNull();
      expect(component.errorBusqueda).toBeNull();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/2');
      req.flush(mockOrder);
    });
  });

  describe('Integración: Ver todos los pedidos', () => {
    it('should reset search state and reload all orders', () => {
      component.pedidoBuscado = { id: 1 };
      component.errorBusqueda = 'Error encontrado';
      component.buscarId = 1;

      component.verTodos();

      expect(component.pedidoBuscado).toBeNull();
      expect(component.errorBusqueda).toBeNull();
      expect(component.buscarId).toBeNull();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/my-orders');
      req.flush(mockOrders);

      expect(component.orders).toEqual(mockOrders);
      expect(component.loading).toBe(false);
    });
  });

  describe('Integración: Servicio y Componente', () => {
    it('should call orderService.getUserOrders() when cargarPedidos is called', () => {
      component.cargarPedidos();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/my-orders');
      expect(req.request.method).toBe('GET');
      req.flush(mockOrders);

      expect(component.orders).toEqual(mockOrders);
      expect(component.loading).toBe(false);
    });

    it('should call orderService.getOrderById() when buscarPedido is called', () => {
      component.buscarId = 1;
      component.buscarPedido();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockOrder);

      expect(component.pedidoBuscado).toEqual(mockOrder);
      expect(component.loading).toBe(false);
    });

    it('should handle multiple consecutive searches', () => {
      // First search
      component.buscarId = 1;
      component.buscarPedido();

      let req = httpMock.expectOne('http://localhost:3000/api/orders/1');
      req.flush(mockOrder);

      expect(component.pedidoBuscado.id).toBe(1);

      // Second search
      component.buscarId = 2;
      component.buscarPedido();

      req = httpMock.expectOne('http://localhost:3000/api/orders/2');
      req.flush({ ...mockOrder, id: 2 });

      expect(component.pedidoBuscado.id).toBe(2);
    });

    it('should include authorization header in all requests', () => {
      localStorage.setItem('token', 'mock-token-12345');

      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/my-orders');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token-12345');
      req.flush(mockOrders);

      localStorage.removeItem('token');
    });
  });
});
