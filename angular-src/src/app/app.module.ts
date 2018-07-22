import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { MatTabsModule } from '@angular/material/tabs';
import { ProductsComponent } from './components/products/products.component';
import { EbayComponent } from './components/ebay/ebay.component';
import { CalculatorComponent } from './components/calculator/calculator.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductsComponent,
    EbayComponent,
    CalculatorComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
