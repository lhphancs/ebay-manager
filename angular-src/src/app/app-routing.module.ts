import { CalculatorNeededSaleComponent } from './components/calculator/calculator-needed-sale/calculator-needed-sale.component';
import { CalculatorProfitComponent } from './components/calculator/calculator-profit/calculator-profit.component';
import { ShippingsComponent } from './components/shippings/shippings.component';
import { FeesComponent } from './components/fees/fees.component';
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
  { path: 'shippings', component: ShippingsComponent, canActivate:[AuthGuard] }, 
  { path: 'fees', component: FeesComponent },
  { path: 'calculator', component: CalculatorComponent, canActivate:[AuthGuard],
    children: [
      { path: '', redirectTo: 'profit', pathMatch: 'full' },
      { path: 'profit', component: CalculatorProfitComponent },
      { path: 'needed-sale', component: CalculatorNeededSaleComponent },
    ]},
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