import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  // formulario
  name = '';
  description = '';
  price!: number;
  stock!: number;
  categoryId!: number;
  imageUrl = '';

  selectedProductId: number | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error(err),
      complete: () => (this.loading = false),
    });
  }

  onEdit(product: Product) {
    this.selectedProductId = product.id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.stock = product.stock;
    this.categoryId = product.categoryId;
    this.imageUrl = product.imageUrl || '';
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que querés eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  onSubmit() {
    const product: Product = {
      id: this.selectedProductId || 0,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      categoryId: this.categoryId,
      imageUrl: this.imageUrl,
    };

    if (this.selectedProductId) {
      this.productService.updateProduct(product).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    } else {
      this.productService.createProduct(product).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    }
  }

  resetForm() {
    this.selectedProductId = null;
    this.name = '';
    this.description = '';
    this.price = 0;
    this.stock = 0;
    this.categoryId = 0;
    this.imageUrl = '';
  }
}

