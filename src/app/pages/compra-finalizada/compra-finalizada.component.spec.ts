import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraFinalizadaComponent } from './compra-finalizada.component';

describe('CompraFinalizadaComponent', () => {
  let component: CompraFinalizadaComponent;
  let fixture: ComponentFixture<CompraFinalizadaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompraFinalizadaComponent]
    });
    fixture = TestBed.createComponent(CompraFinalizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
