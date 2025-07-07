export interface Category {
  id: number;
  name: string;
  
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: number;
  category?: Category;  // hace falta?
}

// Tipo para formularios (crear o editar)
export type ProductForm = Omit<Product, 'id'> & { id?: number };