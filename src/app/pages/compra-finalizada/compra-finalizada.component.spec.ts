import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router'; 
import { CompraFinalizadaComponent } from './compra-finalizada.component';
import { HttpClientModule } from '@angular/common/http';
describe('CompraFinalizadaComponent', () => {
  let component: CompraFinalizadaComponent;
  let fixture: ComponentFixture<CompraFinalizadaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [CompraFinalizadaComponent],
      providers: [
      { provide: ActivatedRoute, useValue: {} }
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
