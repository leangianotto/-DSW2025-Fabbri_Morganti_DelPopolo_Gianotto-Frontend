import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminProductsComponent } from './admin-products.component';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';


describe('AdminProductsComponent', () => {
  let component: AdminProductsComponent;
  let fixture: ComponentFixture<AdminProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminProductsComponent],
      imports: [HttpClientTestingModule,
        FormsModule
      ],
      providers: [ProductService]           
    });
    fixture = TestBed.createComponent(AdminProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
