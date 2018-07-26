import { DatabaseComponent } from './components/database/database.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';


import { EbayComponent } from './components/ebay/ebay.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DatabaseAddComponent } from './components/database/database-add/database-add.component';
import { DatabaseProductsComponent } from './components/database/database-products/database-products.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { DatabaseImportComponent } from './components/database/database-import/database-import.component';
import { DatabaseExportComponent } from './components/database/database-export/database-export.component'; 

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EbayComponent,
    CalculatorComponent,
    DatabaseComponent,
    DatabaseAddComponent,
    DatabaseProductsComponent,
    DatabaseImportComponent,
    DatabaseExportComponent
  ],
  imports: [
    NgbModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    MatOptionModule,
    MatSelectModule,
    FlexLayoutModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
