import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  // propiedades para el formulario de reseña
  rating: number = 5;
  comment: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private reviewService: ReviewService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        if (data.Category) {
          data.category = data.Category;
          delete data.Category;
        }
        this.product = data;
        this.loadReviews();
      },
      error: (err) => console.error(err),
    });
  }

  addToCart(product: Product) {
    if (product.stock === 0) {
      this.toast.showToast('Este producto no tiene stock disponible.', 'warning');
      return;
    }
  
    this.cartService.addProduct(product);
    this.toast.showToast('Producto agregado al carrito.', 'success');
  }
  

  loadReviews() {
    this.reviewService.getReviewsByProduct(this.product.id).subscribe({
      next: (data) => (this.reviews = data),
      error: (err) => console.error(err),
    });
  }

  //  Enviar reseña
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
  
}


