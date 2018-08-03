import { AuthGuard } from './guards/auth.guards';
import { RegisterComponent } from './components/register/register.component';
import { DatabaseProductsComponent } from './components/database/database-products/database-products.component';
import { DatabaseAddOrUpdateComponent } from './components/database/database-add-or-update/database-add-or-update.component';
import { DatabaseComponent } from './components/database/database.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalculatorComponent } from './components/calculator/calculator.component';
import { EbayComponent } from './components/ebay/ebay.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'ebay', component: EbayComponent, canActivate:[AuthGuard] },
  { path: 'database', component: DatabaseComponent, canActivate:[AuthGuard], 
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: DatabaseProductsComponent },
      { path: 'update/:UPC', component: DatabaseAddOrUpdateComponent },
      { path: 'add', component: DatabaseAddOrUpdateComponent }
    ]},
  { path: 'calculator', component: CalculatorComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  providers: [AuthGuard],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }