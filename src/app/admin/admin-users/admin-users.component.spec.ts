import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminUsersComponent } from './admin-users.component';
import { FormsModule } from '@angular/forms';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUsersComponent],
      imports: [HttpClientTestingModule,
        FormsModule
      ]
    });
    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
