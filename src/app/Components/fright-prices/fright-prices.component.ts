import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { freightPrices } from 'src/app/Models/frightPrices';
import { AuthService } from 'src/app/Services/auth.service';
import { FrightpricesService } from 'src/app/Services/frightprices.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { CapitlizeFirstLater, Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { FrightPriceUpdateComponent } from '../fright-price-update/fright-price-update.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-fright-prices',
  templateUrl: './fright-prices.component.html',
  styleUrls: ['./fright-prices.component.sass']
})
export class FrightPricesComponent implements OnInit {

  FrightPricesList: freightPrices[] = [];

  progressRef: any
  constructor(private FirghtpricesSer: FrightpricesService,
    private notification: NotificationserService,
    private router: Router,
    private dialog: MatDialog,
    private AuthSer: AuthService,
    private spinner: Spinner,
  ) { }

  ngOnInit(): void {
    CheckToken(this.router)
    this.GetFrightPrices();
  }
  UpdateSinglePrice(FrightPriceToUpdate: freightPrices) {
    this.dialog.open(FrightPriceUpdateComponent, {
      height: '30rem',
      width: '40rem',
      data: FrightPriceToUpdate
    })
  }

  GetFrightPrices() {
    this.spinner.WrapWithSpinner(this.FirghtpricesSer.GetAllFrightPrices().then((freightPrices: any) => {
      this.FrightPricesList = freightPrices;
      this.SetFreightPricesForDisplay();
    }, (err: any) => {
      Auth_error_handling(err, this.notification, this.router)
    }))
  }

  SetFreightPricesForDisplay(){
    this.FrightPricesList.forEach(FrightPrice => this.CapitlizeLocationFirstLater(FrightPrice))
  }
  CapitlizeLocationFirstLater(FreightPrice: freightPrices){
    FreightPrice.locations = CapitlizeFirstLater(FreightPrice.locations)
  }

  CheckRole() {
    return (localStorage.getItem('Role') == "admin" || localStorage.getItem('Role') == "alfemo") ? true : false;
  }
}
