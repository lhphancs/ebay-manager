import { DatabaseProductsComponent } from './components/database/database-products/database-products.component';
import { DatabaseAddOrUpdateComponent } from './components/database/database-add-or-update/database-add-or-update.component';
import { DatabaseComponent } from './components/database/database.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalculatorComponent } from './components/calculator/calculator.component';
import { EbayComponent } from './components/ebay/ebay.component';

const routes: Routes = [
  { path: '', redirectTo: 'ebay', pathMatch: 'full' },

  { path: 'ebay', component: EbayComponent },
  { path: 'database', component: DatabaseComponent, 
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: DatabaseProductsComponent },
      { path: 'products/update/:UPC', component: DatabaseAddOrUpdateComponent },
      { path: 'add', component: DatabaseAddOrUpdateComponent }
    ]},
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