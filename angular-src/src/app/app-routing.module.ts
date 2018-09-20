import { ShippingsAddOrUpdateComponent } from './components/shippings-add-or-update/shippings-add-or-update.component';
import { ShippingsComponent } from './components/shippings/shippings.component';
import { LogoutComponent } from './components/logout/logout.component';
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

import { EbayComponent } from './components/ebay/ebay.component';
import { LoginComponent } from './components/login/login.component';
import { EbayCalculationsComponent } from './components/ebay/ebay-calculations/ebay-calculations.component';
import { EbayCalculatorComponent } from './components/ebay/ebay-calculator/ebay-calculator.component';
import { EbayListingsComponent } from './components/ebay/ebay-listings/ebay-listings.component';
import { EbayUpdateFeesComponent } from './components/ebay/ebay-update-fees/ebay-update-fees.component';
import { EbayUpdateKeyComponent } from './components/ebay/ebay-update-key/ebay-update-key.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'amazon', component: AmazonComponent, canActivate:[AuthGuard] },
  { path: 'ebay', component: EbayComponent, canActivate:[AuthGuard],
    children: [
      { path: '', redirectTo: 'calculations', pathMatch: 'full' },
      { path: 'calculations', component: EbayCalculationsComponent },
      { path: 'listings', component: EbayListingsComponent },
      { path: 'calculator', component: EbayCalculatorComponent },
      { path: 'update-fees', component: EbayUpdateFeesComponent },
      { path: 'update-key', component: EbayUpdateKeyComponent },
    ]
  },
  { path: 'account', component: AccountComponent, canActivate:[AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate:[AuthGuard] }, 
  { path: 'products', component: ProductsComponent, canActivate:[AuthGuard], 
    children: [
      { path: '', redirectTo: 'display', pathMatch: 'full' },
      { path: 'display', component: ProductsDisplayComponent },
      { path: 'update/:UPC', component: ProductsAddOrUpdateComponent },
      { path: 'add', component: ProductsAddOrUpdateComponent }
    ]
  },
  { path: 'shippings', component: ShippingsComponent, canActivate:[AuthGuard] }, 
  { path: 'shippings/new-ship-company', component: ShippingsAddOrUpdateComponent, canActivate:[AuthGuard] }, 
  { path: 'shippings/:mode/:id', component: ShippingsAddOrUpdateComponent, canActivate:[AuthGuard] }, 
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