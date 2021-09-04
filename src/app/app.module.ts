import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminReviewComponent } from './Components/admin-review/admin-review.component';
import { AdminComponent } from './Components/admin/admin.component';
import { AlfemoUpdateComponent } from './Components/alfemo-update/alfemo-update.component';
import { AlfemoComponent } from './Components/alfemo/alfemo.component';
import { CatalogComponent } from './Components/catalog/catalog.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { HomeComponent } from './Components/home/home.component';

import { LogInComponent } from './Components/log-in/log-in.component';
import { MyPosComponent } from './Components/my-pos/my-pos.component';
import { NewPoComponent } from './Components/new-po/new-po.component';
import { TokeninterceptorService } from './Services/tokeninterceptor.service';

import {BrowserAnimationsModule} from  '@angular/platform-browser/animations';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import { NotificationserService } from './Services/notificationser.service';
import { ProductdetailsComponent } from './Components/productdetails/productdetails.component';

import { NgProgressModule } from 'ngx-progressbar';
import { PoDetailsComponent } from './Components/po-details/po-details.component';
import { FrightPricesComponent } from './Components/fright-prices/fright-prices.component';
import { FrightPriceUpdateComponent } from './Components/fright-price-update/fright-price-update.component';
import { EmptyField, Spinner } from './Utilities/Common';
import { NewDealerComponent } from './Components/new-dealer/new-dealer.component';
import { CorinthianUpdateComponent } from './Components/corinthian-update/corinthian-update.component';
import { DealersComponent } from './Components/dealers/dealers.component';
import { EditdealerinformationComponent } from './Components/editdealerinformation/editdealerinformation.component';
import { DealerProfileComponent } from './Components/dealer-profile/dealer-profile.component';
import { ReportsComponent } from './Components/reports/reports.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CatalogComponent,
    HomeComponent,
    NewPoComponent,
    MyPosComponent,
    AdminComponent,
    AlfemoComponent,
    AdminReviewComponent,
    AlfemoUpdateComponent,
    LogInComponent,
    ProductdetailsComponent,
    PoDetailsComponent,
    FrightPricesComponent,
    FrightPriceUpdateComponent,
    EmptyField,
    NewDealerComponent,
    CorinthianUpdateComponent,
    DealersComponent,
    EditdealerinformationComponent,
    DealerProfileComponent,
    ReportsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgProgressModule,    
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    NotificationserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass:TokeninterceptorService,
      multi: true
    },
    HeaderComponent,
    Spinner,
    AppComponent,
    AdminComponent,
    MyPosComponent,
    AlfemoComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
