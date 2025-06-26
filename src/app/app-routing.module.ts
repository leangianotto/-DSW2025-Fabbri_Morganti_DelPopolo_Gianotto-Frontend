import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProfileComponent } from './components/profile/profile.component';

import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';

import { AdminGuard } from './guards/admin.guard'; 

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileComponent },

  //  Rutas protegidas por rol admin
  { path: 'admin/products', component: AdminProductsComponent, canActivate: [AdminGuard] },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AdminGuard] },
  { path: 'admin/categories', component: AdminCategoriesComponent, canActivate: [AdminGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
