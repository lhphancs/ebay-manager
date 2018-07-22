import { ProductsComponent } from './components/products/products.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalculatorComponent } from './components/calculator/calculator.component';
import { EbayComponent } from './components/ebay/ebay.component';

const routes: Routes = [
  { path: '', redirectTo: 'ebay', pathMatch: 'full' },

  { path: 'ebay', component: EbayComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'calculator', component: CalculatorComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  providers: [],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }