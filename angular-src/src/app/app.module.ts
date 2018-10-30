import { ShippingsAddOrUpdateComponent } from './components/shippings-add-or-update/shippings-add-or-update.component';
import { ProductsDisplayComponent } from './components/products/products-display/products-display.component';
import { ProductsAddOrUpdateComponent } from './components/products/products-add-or-update/products-add-or-update.component';
import { ProductsComponent } from './components/products/products.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { EbayComponent } from './components/ebay/ebay.component';
import { EbayListingsComponent } from './components/ebay/ebay-listings/ebay-listings.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule, MatButtonToggleModule, MatTooltipModule, MatExpansionModule, MatSlideToggleModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MatMenuModule } from '@angular/material/menu';
import { AccountComponent } from './components/account/account.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AmazonComponent } from './components/amazon/amazon.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ShippingsComponent } from './components/shippings/shippings.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { TableDynamicInputComponent } from './components/table-dynamic-input/table-dynamic-input.component';
import { EbayCalculationsComponent } from './components/ebay/ebay-calculations/ebay-calculations.component';
import { EbayCalculatorComponent } from './components/ebay/ebay-calculator/ebay-calculator.component';
import { AccountPasswordComponent } from './components/account/account-password/account-password.component';
import { EbayUpdateSettingsComponent } from './components/ebay/ebay-update-settings/ebay-update-settings.component';
import { EbayUpdateSettingsFeesComponent } from './components/ebay/ebay-update-settings/ebay-update-settings-fees/ebay-update-settings-fees.component';
import { EbayUpdateSettingsAccountComponent } from './components/ebay/ebay-update-settings/ebay-update-settings-account/ebay-update-settings-account.component';
import 'hammerjs';
import { ShopifyComponent } from './components/shopify/shopify.component';
import { ShopifyUpdateSettingsComponent } from './components/shopify/shopify-update-settings/shopify-update-settings.component';
import { ShopifyCalculationsComponent } from './components/shopify/shopify-calculations/shopify-calculations.component';
import { NavtabsComponent } from './components/navtabs/navtabs.component';
import { CalculationsComponent } from './components/calculations/calculations.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    EbayComponent,
    ProductsComponent,
    ProductsAddOrUpdateComponent,
    ProductsDisplayComponent,
    ConfirmDialogComponent,
    LoginComponent,
    RegisterComponent,
    AccountComponent,
    SettingsComponent,
    AmazonComponent,
    LogoutComponent,
    ShippingsComponent,
    ShippingsAddOrUpdateComponent,
    ProgressSpinnerComponent,
    TableDynamicInputComponent,
    EbayCalculationsComponent,
    EbayCalculatorComponent,
    AccountPasswordComponent,
    EbayListingsComponent,
    EbayUpdateSettingsComponent,
    EbayUpdateSettingsFeesComponent,
    EbayUpdateSettingsAccountComponent,
    ShopifyComponent,
    ShopifyUpdateSettingsComponent,
    ShopifyCalculationsComponent,
    NavtabsComponent,
    CalculationsComponent
  ],
  imports: [
    NgbModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialogComponent]
})
export class AppModule { }
