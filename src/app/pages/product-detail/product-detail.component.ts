import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ReviewService, Review } from 'src/app/services/review.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  reviews: Review[] = [];

  // formulario de reseña
  rating: number = 5;
  comment: string = '';
  hoveredRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private reviewService: ReviewService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProductById(id).subscribe({
      next: (data) => {
        // ⛔ Si el producto está inactivo, lo sacamos
        if (!data.active) {
          this.toast.showToast('Este producto no está disponible.', 'warning');
          this.router.navigate(['/']);
          return;
        }

        this.product = data;
        this.loadReviews();
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/']);
      },
    });
  }

 addToCart(product: Product) {
  const currentItem = this.cartService.getCartItem(product.id);

  // ❌ Sin stock
  if (product.stock === 0) {
    this.toast.showToast('Este producto no tiene stock disponible.', 'warning');
    return;
  }

  // ❌ Excede el stock disponible
  if (currentItem && currentItem.quantity >= product.stock) {
    this.toast.showToast(
      `No puedes agregar más. Stock disponible: ${product.stock}`,
      'warning'
    );
    return;
  }

  // ✔ Ok, agregar
  this.cartService.addProduct(product);
  this.toast.showToast('Producto agregado al carrito.', 'success');
}

  loadReviews() {
    this.reviewService.getReviewsByProduct(this.product.id).subscribe({
      next: (data) => (this.reviews = data),
      error: (err) => console.error(err),
    });
  }

  submitReview() {
    const review = {
      productId: this.product.id,
      rating: this.rating,
      comment: this.comment,
    };

    this.reviewService.addReview(this.product.id, review).subscribe({
      next: () => {
        this.toast.showToast('Reseña enviada con éxito.', 'success');
        this.comment = '';
        this.rating = 5;
        this.loadReviews();
      },
      error: (err) => {
        if (err.status === 401) {
          this.toast.showToast('Debes iniciar sesión para dejar una reseña.', 'warning');
        } else {
          this.toast.showToast('Hubo un error al enviar la reseña.', 'danger');
        }
      },
    });
  }

  get averageRating(): number {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    return +(total / this.reviews.length).toFixed(1);
  }

  get averageRatingRounded(): number {
    return Math.round(this.averageRating);
  }

  get totalReviews(): number {
    return this.reviews.length;
  }

  getStarsArray(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => (i < rating ? 1 : 0));
  }
}
