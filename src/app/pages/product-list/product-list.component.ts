


import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  loading: boolean = true;

 

  constructor(private productService: ProductService,
    private cartService: CartService) {}

  ngOnInit(): void {
    this.loadAllProducts();
  }



  loadAllProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error al cargar productos:', err),
      complete: () => this.loading = false
    });
  }

  getByCategory(categoryId: number): void {
    this.loading = true;
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (data) => this.products = data,
      error: (error) => console.error('Error al obtener productos por categoría:', error),
      complete: () => this.loading = false
    });
  }

  addToCart(product: Product) {
    this.cartService.addProduct(product);
    alert('Producto agregado al carrito');
  }
}






