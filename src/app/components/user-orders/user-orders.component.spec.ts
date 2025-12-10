import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserOrdersComponent } from './user-orders.component';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
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

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('Integración: Carga de pedidos del usuario', () => {
    it('debería cargar los pedidos del usuario al iniciar', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/my-orders');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBe(true);

      req.flush(mockOrders);

      expect(component.orders).toEqual(mockOrders);
      expect(component.loading).toBe(false);
    });

    it('debería establecer loading en true mientras obtiene los pedidos', (done) => {
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

    it('debería manejar el error al cargar los pedidos del usuario', () => {
      jest.spyOn(console, 'error').mockImplementation(); //Oculta errores por usar mocks TEST SI FUNCIONA
      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/my-orders');
      req.error(new ErrorEvent('Network error'), { status: 500, statusText: 'Internal Server Error' });

      expect(component.loading).toBe(false);
      expect(component.orders.length).toBe(0);
    });
  });

  describe('Integración: Búsqueda de pedido por ID', () => {
    it('debería buscar el pedido por id y mostrarlo', () => {
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

    it('debería manejar el error al buscar el pedido por id', () => {
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

    it('debería manejar el mensaje de error personalizado del servidor', () => {
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

    it('debería no buscar si buscarId es null', () => {
      component.buscarId = null;
      component.buscarPedido();

      httpMock.expectNone('http://localhost:3000/api/orders/null');
    });

    it('debería reiniciar el estado de búsqueda cuando se llama a buscarPedido', () => {
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
    it('debería reiniciar el estado de búsqueda y recargar todos los pedidos', () => {
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
    it('debería llamar a orderService.getUserOrders() cuando se llama a cargarPedidos', () => {
      component.cargarPedidos();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/my-orders');
      expect(req.request.method).toBe('GET');
      req.flush(mockOrders);

      expect(component.orders).toEqual(mockOrders);
      expect(component.loading).toBe(false);
    });

    it('debería llamar a orderService.getOrderById() cuando se llama a buscarPedido', () => {
      component.buscarId = 1;
      component.buscarPedido();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockOrder);

      expect(component.pedidoBuscado).toEqual(mockOrder);
      expect(component.loading).toBe(false);
    });

    it('debería manejar múltiples búsquedas consecutivas', () => {
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

    it('debería incluir el encabezado de autorización en todas las solicitudes', () => {
      localStorage.setItem('token', 'mock-token-12345');

      fixture.detectChanges();

      const req = httpMock.expectOne('http://localhost:3000/api/orders/my-orders');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token-12345');
      req.flush(mockOrders);

      localStorage.removeItem('token');
    });
  });
});
