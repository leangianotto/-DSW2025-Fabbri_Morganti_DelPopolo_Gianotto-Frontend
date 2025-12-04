import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import { AdminCategoriesComponent } from './admin-categories.component';

describe('AdminCategoriesComponent', () => {
  let component: AdminCategoriesComponent;
  let fixture: ComponentFixture<AdminCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [AdminCategoriesComponent]
    });
    fixture = TestBed.createComponent(AdminCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
