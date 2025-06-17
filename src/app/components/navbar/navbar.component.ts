import { Component, OnInit, OnDestroy  } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit , OnDestroy {
  userName: string | null = null;
  private userSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.userName = user ? user.name : null;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
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
