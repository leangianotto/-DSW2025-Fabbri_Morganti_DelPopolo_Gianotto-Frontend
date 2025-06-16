import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadAllProducts();  // al iniciar, cargo todos los productos
  }

  loadAllProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error al cargar productos:', err),
      complete: () => console.log('Carga de productos completada')
    });
  }

  getByCategory(categoryId: number) {
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (data) => this.products = data,
      error: (error) => console.error('Error al obtener productos por categoría:', error),
      complete: () => console.log('Productos por categoría cargados')
    });
  }
  

}



