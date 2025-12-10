import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  topSellingProducts: any[] = [];

  testimonials = [
    { user: 'Lucía M.', comment: 'Excelente atención y envío rápido.' },
    { user: 'Juan P.', comment: 'Productos de calidad y buen precio.' },
    { user: 'Marta G.', comment: 'Muy recomendable, volveré a comprar seguro.' },
  ];



  newsletterEmail: string = '';
  newsletterMessage: string = '';

  contact = { name: '', email: '', message: '' };
  contactSuccess: string = '';

  constructor(private productService: ProductService) {}

ngOnInit(): void {
  this.productService.getProducts().subscribe({
    next: (data) => {
      this.featuredProducts = data.slice(0, 4);
    },
    error: (err) => console.error(err),
  });

  this.loadTopSellingProducts(); 
}


  loadFeaturedProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.featuredProducts = data.slice(0, 4); // primeros 4 productos
      },
      error: (err) => console.error('Error al cargar productos destacados:', err),
    });
  }

  loadTopSellingProducts(): void {
    this.productService.getTopSellingProducts().subscribe({
      next: (data) => {
        console.log(' Top vendidos crudos:', data);
    
        this.topSellingProducts = data
  .filter(item => item.Product)
  .map(item => ({
    product: {
      ...item.Product,
      image: item.Product.imageUrl || 'default.jpg'  
    },
    totalVendidas: item.totalVendidas
  }));

    
        console.log(' Procesados:', this.topSellingProducts);
      },
      error: (err) => console.error('Error al cargar más vendidos:', err),
    });
  }

  subscribeNewsletter() {
    if (!this.newsletterEmail) return;
    this.newsletterMessage = 'Gracias por suscribirte, pronto recibirás novedades!';
    this.newsletterEmail = '';
  }

  submitContact() {
    if (!this.contact.name || !this.contact.email || !this.contact.message) return;
    this.contactSuccess = 'Gracias por contactarnos, responderemos pronto.';
    this.contact = { name: '', email: '', message: '' };
  }
}


