import { LogoutComponent } from './components/logout/logout.component';
import { ShippingComponent } from './components/shipping/shipping.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductsAddOrUpdateComponent } from './components/products/products-add-or-update/products-add-or-update.component';
import { ProductsDisplayComponent } from './components/products/products-display/products-display.component';
import { AmazonComponent } from './components/amazon/amazon.component';
import { AccountComponent } from './components/account/account.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AuthGuard } from './guards/auth.guards';
import { RegisterComponent } from './components/register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalculatorComponent } from './components/calculator/calculator.component';
import { EbayComponent } from './components/ebay/ebay.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'amazon', component: AmazonComponent, canActivate:[AuthGuard] },
  { path: 'ebay', component: EbayComponent, canActivate:[AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate:[AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate:[AuthGuard] }, 
  { path: 'products', component: ProductsComponent, canActivate:[AuthGuard] , 
    children: [
      { path: '', redirectTo: 'display', pathMatch: 'full' },
      { path: 'display', component: ProductsDisplayComponent },
      { path: 'update/:UPC', component: ProductsAddOrUpdateComponent },
      { path: 'add', component: ProductsAddOrUpdateComponent }
    ]},
  { path: 'shipping', component: ShippingComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'logout', component: LogoutComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuard],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }