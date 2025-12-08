import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
  TestBed.runInInjectionContext(() => {
    const guardFunction = inject(AdminGuard) as unknown as CanActivateFn;
    return guardFunction(...guardParameters);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
