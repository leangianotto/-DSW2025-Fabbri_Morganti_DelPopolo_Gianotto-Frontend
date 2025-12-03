import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from 'src/app/services/category.service';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {

  categories: Category[] = [];
  newCategoryName: string = '';

  editingCategory: Category | null = null;
  updatedName: string = '';

  // 🔥 Modal Universal
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  actionToConfirm: (() => void) | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  /** CARGAR CATEGORÍAS */
  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error al cargar categorías', err),
    });
  }

  /** CREAR */
  createCategory() {
    if (!this.newCategoryName.trim()) return;

    this.categoryService.create(this.newCategoryName).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.loadCategories();
      },
      error: (err) => console.error('Error al crear categoría', err),
    });
  }

  /** EDITAR */
  startEdit(category: Category) {
    this.editingCategory = { ...category };
    this.updatedName = category.name;
  }

  saveEdit() {
    if (!this.editingCategory) return;

    this.categoryService.update(this.editingCategory.id, this.updatedName).subscribe({
      next: () => {
        this.editingCategory = null;
        this.updatedName = '';
        this.loadCategories();
      },
      error: (err) => console.error('Error al editar categoría', err),
    });
  }

  cancelEdit() {
    this.editingCategory = null;
    this.updatedName = '';
  }

  /** ================== MODAL UNIVERSAL ================== */

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

  /** ================== ELIMINAR ================== */

  askDeleteCategory(id: number) {
    this.openModal(
      'Eliminar categoría',
      '¿Seguro que querés eliminar esta categoría? Esta acción NO se puede deshacer.',
      () => this.deleteCategory(id)
    );
  }

  deleteCategory(id: number) {
    this.categoryService.delete(id).subscribe({
      next: () => this.loadCategories(),
      error: (err) => console.error('Error al eliminar categoría', err),
    });
  }
}
