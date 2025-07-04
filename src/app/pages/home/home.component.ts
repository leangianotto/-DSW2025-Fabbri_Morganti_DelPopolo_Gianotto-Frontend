import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';

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

  brands = [
    { name: 'Apple', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Samsung', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
    { name: 'Sony', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Sony_logo.svg' },
    { name: 'Dell', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg' },
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
  
    this.loadTopSellingProducts(); // ← 🔥 esta línea era lo que faltaba
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
        console.log('✅ Top vendidos crudos:', data);
    
        this.topSellingProducts = data
          .filter(item => item.Product)
          .map(item => ({
            product: item.Product,             // ⬅️ CORRECTO
            totalVendidas: item.totalVendidas
          }));
    
        console.log('🟢 Procesados:', this.topSellingProducts);
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


