import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ReviewService, Review } from 'src/app/services/review.service';

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
    private reviewService: ReviewService
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
    this.cartService.addProduct(product);
    alert('Producto agregado al carrito');
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
        alert('Reseña enviada con éxito');
        this.comment = '';
        this.rating = 5;
        this.loadReviews(); // recargar reseñas
      },
      error: (err) => {
        console.error('Error al enviar reseña:', err);
        if (err.status === 401) {
          alert('Debes iniciar sesión para dejar una reseña.');
        } else {
          alert('Hubo un error al enviar la reseña. Intenta nuevamente.');
        }
      }
      
    });
  }
}


