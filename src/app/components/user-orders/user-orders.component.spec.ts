import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserOrdersComponent } from './user-orders.component';
import { FormsModule } from '@angular/forms';


describe('UserOrdersComponent', () => {
  let component: UserOrdersComponent;
  let fixture: ComponentFixture<UserOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserOrdersComponent],
      imports: [HttpClientTestingModule,
        FormsModule
      ],
      
    });
    fixture = TestBed.createComponent(UserOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
