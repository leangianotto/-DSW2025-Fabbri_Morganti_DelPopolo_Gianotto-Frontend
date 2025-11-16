import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CartService } from 'src/app/services/cart.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading: boolean = true;

  searchTerm: string = '';
  sortOption: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 8;

  addingProductId: number | null = null;

  mostrandoMasVendidos: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAllProducts();
  }

  private normalizeProductImage(product: any): Product {
    return {
      ...product,
      image: product.image || product.imageUrl || 'default.jpg'
    };
  }

  loadAllProducts(): void {
    this.loading = true;
    this.mostrandoMasVendidos = false;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.map(p => this.normalizeProductImage(p));
        this.applyFilters();
      },
      error: (err) => console.error('Error al cargar productos:', err),
      complete: () => (this.loading = false)
    });
  }

  loadMasVendidos(): void {
    this.loading = true;
    this.mostrandoMasVendidos = true;

    this.productService.getTopSellingProducts().subscribe({
      next: (data) => {
        this.products = data.map(p => this.normalizeProductImage(p.Product));
        this.applyFilters();
      },
      error: (err) => console.error('Error al obtener más vendidos:', err),
      complete: () => (this.loading = false)
    });
  }

  getByCategory(categoryId: number): void {
    this.loading = true;
    this.mostrandoMasVendidos = false;
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (data) => {
        this.products = data.map(p => this.normalizeProductImage(p));
        this.currentPage = 1;
        this.applyFilters();
      },
      error: (err) => console.error('Error al obtener productos por categoría:', err),
      complete: () => (this.loading = false)
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.sortOption === 'asc') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'desc') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    }
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  // 🔥 VALIDACIÓN COMPLETA DE STOCK AL AGREGAR
  addToCart(product: Product): void {
    if (product.stock === 0) {
      this.toast.showToast('Este producto no tiene stock disponible.', 'warning');
      return;
    }

    this.addingProductId = product.id;

    // Obtenemos carrito actual desde localStorage
    const cart = JSON.parse(localStorage.getItem(this.cartService['getCartKey']()) || '[]');

    const existing = cart.find((i: any) => i.product.id === product.id);

    // Si ya existe en carrito → validar si puede sumar 1 más
    if (existing) {
      if (existing.quantity >= product.stock) {
        this.toast.showToast(
          `Solo hay ${product.stock} unidades disponibles. Ya alcanzaste el máximo.`,
          'warning'
        );

        this.addingProductId = null;
        return;
      }

      // Puede sumar 1 → lo agregamos
      this.cartService.addProduct(product);
      this.toast.showToast('Producto agregado al carrito.', 'success');
    } else {
      // No existe → agregarlo normalmente
      this.cartService.addProduct(product);
      this.toast.showToast('Producto agregado al carrito.', 'success');

      if (product.stock === 1) {
        this.toast.showToast('Ojo: queda solo 1 en stock.', 'info');
      }
    }

    setTimeout(() => {
      this.addingProductId = null;
    }, 1000);
  }
}
