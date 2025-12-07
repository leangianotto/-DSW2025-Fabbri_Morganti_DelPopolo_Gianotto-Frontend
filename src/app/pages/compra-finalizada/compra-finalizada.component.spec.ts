import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router'; 
import { CompraFinalizadaComponent } from './compra-finalizada.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CompraFinalizadaComponent', () => {
  let component: CompraFinalizadaComponent;
  let fixture: ComponentFixture<CompraFinalizadaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CompraFinalizadaComponent],
      providers: [
      { 
        provide: ActivatedRoute,
          useValue: {
            snapshot: {
            paramMap: {
              get: () => null
            },
            queryParamMap: {  
              get: () => null
            } 
          }
        }
      }
    
      ]
    });
    fixture = TestBed.createComponent(CompraFinalizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
