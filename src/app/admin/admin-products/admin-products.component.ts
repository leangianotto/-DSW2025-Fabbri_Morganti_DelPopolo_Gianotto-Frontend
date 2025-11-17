import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product, ProductForm } from 'src/app/models/product';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  // Formulario
  name = '';
  description = '';
  price: number = 0;
  stock: number = 0;
  categoryId: number = 0;
  image: string = '';

  active: boolean = true; // <-- controla el checkbox
  selectedProductId: number | null = null;

  // 🔥 Modal universal
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  actionToConfirm: (() => void) | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  /** Carga TODOS los productos (activos + inactivos) */
  loadProducts() {
    this.productService.getAllProductsAdmin().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error(err),
      complete: () => (this.loading = false),
    });
  }

  /** Cargar formulario para edición */
  onEdit(product: Product) {
    this.selectedProductId = product.id;

    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.stock = product.stock;
    this.categoryId = product.categoryId;
    this.image = product.image ?? '';
    this.active = product.active; // <-- carga el checkbox

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** ================= MODAL UNIVERSAL ================= */
  openModal(title: string, message: string, action: () => void) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.actionToConfirm = action;
    this.showModal = true;
  }

  cancelModal() {
    this.showModal = false;
    this.actionToConfirm = null;
  }

  confirmModal() {
    if (this.actionToConfirm) this.actionToConfirm();
    this.cancelModal();
  }

  /** ================= DESACTIVAR / ACTIVAR ================= */
  askDisableProduct(id: number) {
    this.openModal(
      'Desactivar producto',
      '¿Seguro que querés desactivar este producto?',
      () => this.onDisable(id)
    );
  }

  onDisable(id: number) {
    this.productService.deactivateProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error(err),
    });
  }

  onEnable(id: number) {
    this.productService.activateProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error(err),
    });
  }

  /** ================= CREAR / EDITAR ================= */
  onSubmit() {
    const productForm: ProductForm = {
      id: this.selectedProductId ?? undefined,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      categoryId: this.categoryId,
      image: this.image,
      active: this.active,
    };

    // --- EDICIÓN ---
    if (this.selectedProductId != null) {
      this.productService.updateProduct(productForm).subscribe({
        next: () => {
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => console.error('Update error:', err),
      });
      return;
    }

    // --- CREACIÓN ---
    this.productService.createProduct(productForm).subscribe({
      next: () => {
        this.resetForm();
        this.loadProducts();
      },
      error: (err) => console.error('Create error:', err),
    });
  }

  resetForm() {
    this.selectedProductId = null;
    this.name = '';
    this.description = '';
    this.price = 0;
    this.stock = 0;
    this.categoryId = 0;
    this.image = '';
    this.active = true;
  }
}
