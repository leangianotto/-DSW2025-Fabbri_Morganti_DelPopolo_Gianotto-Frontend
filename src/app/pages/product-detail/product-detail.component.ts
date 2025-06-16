import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product!: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        // Cambio Category a category porque no lograba me muestre el nombre de la cat.
        if (data.Category) {
          data.category = data.Category;
          delete data.Category;
        }
        this.product = data;
        console.log(this.product); // para verificar
      },
      error: (err) => console.error(err),
    });
  }
}

