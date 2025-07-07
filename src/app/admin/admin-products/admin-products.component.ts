import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product, ProductForm} from 'src/app/models/product';

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
  image = '';

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
    this.image = product.image || '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que querés eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  onSubmit() {
     const productForm: ProductForm = {
    id: this.selectedProductId ?? undefined,
    name: this.name,
    description: this.description,
    price: this.price,
    stock: this.stock,
    categoryId: this.categoryId,
    image: this.image,
  };

  console.log('onSubmit, productForm:', productForm);

  if (this.selectedProductId !== null && this.selectedProductId !== undefined) {
    const productToUpdate: Product = {
      ...productForm,
      id: this.selectedProductId,
    };
    console.log('Updating product:', productToUpdate);

    this.productService.updateProduct(productToUpdate).subscribe({
      next: (res) => {
        console.log('Update response:', res);
        this.resetForm();
        this.loadProducts();
      },
      error: (err) => {
        console.error('Update error:', err);
      }
    });
  } else {
    this.productService.createProduct(productForm).subscribe({
      next: (res) => {
        console.log('Create response:', res);
        this.resetForm();
        this.loadProducts();
      },
      error: (err) => {
        console.error('Create error:', err);
      }
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
    this.image = '';
  }
}

