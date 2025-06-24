import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service'; // <--

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userName: string | null = null;
  cartCount = 0;

  private userSubscription!: Subscription;
  private cartSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService, // <--
    private router: Router
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      this.userName = user ? user.name : null;
    });

    this.cartSubscription = this.cartService.cartCount$.subscribe((count: number) => {
      this.cartCount = count;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.userName = null;
    this.router.navigate(['/login']);
  }

  loadUser() {
    const user = this.authService.getUser();
    this.userName = user ? user.name : null;
  }
}


