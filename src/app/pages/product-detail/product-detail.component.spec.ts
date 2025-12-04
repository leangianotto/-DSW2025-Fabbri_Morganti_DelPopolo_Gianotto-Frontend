import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailComponent } from './product-detail.component';
import { HttpClientModule } from '@angular/common/http';
describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDetailComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1' 
          } 
        }
      }
    }
      ]
    });
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
