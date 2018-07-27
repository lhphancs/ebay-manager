import { DatabaseProductInfoComponent } from './components/database/database-product-info/database-product-info.component';
import { DatabaseExportComponent } from './components/database/database-export/database-export.component';
import { DatabaseImportComponent } from './components/database/database-import/database-import.component';
import { DatabaseProductsComponent } from './components/database/database-products/database-products.component';
import { DatabaseAddComponent } from './components/database/database-add/database-add.component';
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
      { path: 'products/:UPC', component: DatabaseProductInfoComponent },
      { path: 'add', component: DatabaseAddComponent },
      { path: 'import', component: DatabaseImportComponent },
      { path: 'export', component: DatabaseExportComponent }
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