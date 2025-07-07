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

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  createCategory() {
    if (!this.newCategoryName.trim()) return;

    this.categoryService.create(this.newCategoryName).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.loadCategories();
      },
      error: (err) => console.error('Error al crear categoría', err)
    });
  }

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
      error: (err) => console.error('Error al editar categoría', err)
    });
  }

  cancelEdit() {
    this.editingCategory = null;
    this.updatedName = '';
  }

  deleteCategory(id: number) {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoryService.delete(id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => console.error('Error al eliminar categoría', err)
      });
    }
  }
}

