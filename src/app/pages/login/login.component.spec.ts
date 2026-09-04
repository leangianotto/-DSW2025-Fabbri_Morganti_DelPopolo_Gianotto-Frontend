import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecaptchaModule } from 'ng-recaptcha';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule,
        FormsModule,
        RecaptchaModule
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar "Sitio no disponible" cuando el servidor está caído (status 0)', () => {
    const toastSpy = jest.spyOn(toastService, 'showToast');
    jest.spyOn(authService, 'login').mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' }))
    );

    component.email = 'test@example.com';
    component.password = '123456';
    component.captchaToken = 'dummy-token';

    component.onSubmit();

    expect(toastSpy).toHaveBeenCalledWith(
      'Sitio no disponible. Intenta nuevamente más tarde.',
      'danger'
    );
  });

  it('debería mostrar "Sitio no disponible" cuando hay un error interno del servidor (status 500)', () => {
    const toastSpy = jest.spyOn(toastService, 'showToast');
    jest.spyOn(authService, 'login').mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' }))
    );

    component.email = 'test@example.com';
    component.password = '123456';
    component.captchaToken = 'dummy-token';

    component.onSubmit();

    expect(toastSpy).toHaveBeenCalledWith(
      'Sitio no disponible. Intenta nuevamente más tarde.',
      'danger'
    );
  });

  it('debería mostrar "Email o contraseña incorrectos." cuando las credenciales son inválidas (status 400)', () => {
    const toastSpy = jest.spyOn(toastService, 'showToast');
    jest.spyOn(authService, 'login').mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { message: 'Credenciales inválidas' } }))
    );

    component.email = 'wrong@example.com';
    component.password = 'wrongpassword';
    component.captchaToken = 'dummy-token';

    component.onSubmit();

    expect(toastSpy).toHaveBeenCalledWith(
      'Email o contraseña incorrectos.',
      'danger'
    );
  });

  it('debería mostrar mensaje de bloqueo cuando el status es 429', () => {
    const toastSpy = jest.spyOn(toastService, 'showToast');
    jest.spyOn(authService, 'login').mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 429, statusText: 'Too Many Requests' }))
    );

    component.email = 'test@example.com';
    component.password = '123456';
    component.captchaToken = 'dummy-token';

    component.onSubmit();

    expect(toastSpy).toHaveBeenCalledWith(
      'Demasiados intentos. Intenta nuevamente en 60 segundos.',
      'danger'
    );
    expect(component.blocked).toBe(true);
  });
});
