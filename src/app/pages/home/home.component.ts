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

  /** ---------- Helpers de imagen (mismos que usamos en otras vistas) ---------- */
  private normalizeProductImage(p: any): Product {
    const raw = p?.image || p?.imageUrl || '';
    if (/^https?:\/\//i.test(raw)) return { ...p, image: raw };

    const cleaned =
      String(raw)
        .replace(/^assets\/images\//i, '')
        .replace(/^images\//i, '')
        .replace(/^\.?\/*/, '')
        .toLowerCase() || 'default.jpg';

    return { ...p, image: cleaned };
  }

  getImageSrc(img?: string): string {
    if (!img) return 'assets/images/default.jpg';
    const s = String(img).trim();
    if (/^https?:\/\//i.test(s)) return s;
    const just = s
      .replace(/^assets\/images\//i, '')
      .replace(/^images\//i, '')
      .replace(/^\.?\/*/, '')
      .toLowerCase();
    return `assets/images/${just}`;
  }

  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = 'assets/images/default.jpg';
  }
  /** ------------------------------------------------------------------------- */

  loadFeaturedProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.featuredProducts = data.map(p => this.normalizeProductImage(p)).slice(0, 4); // primeros 4 productos
      },
      error: (err) => console.error('Error al cargar productos destacados:', err),
    });
  }

  loadTopSellingProducts(): void {
    this.productService.getTopSellingProducts().subscribe({
      next: (data) => {
        console.log('✅ Top vendidos crudos:', data);
    
        this.topSellingProducts = (Array.isArray(data) ? data : [])
          .filter(item => item && item.Product)
          .map(item => ({
            product: this.normalizeProductImage(item.Product),
            totalVendidas: Number(item.totalVendidas ?? item.cantidad ?? 0),
          }));
      },
      error: (err) => {
        console.error('Error al cargar más vendidos:', err);
        // Fallback para no dejar la home vacía si falla el endpoint
        this.productService.getProducts().subscribe({
          next: (all) => {
            this.topSellingProducts = all
              .slice(0, 4)
              .map(p => ({ product: this.normalizeProductImage(p), totalVendidas: 0 }));
          },
          error: () => { /* silencioso */ }
        });
      },
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


