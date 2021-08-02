import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { frightPrices } from 'src/app/Models/frightPrices';
import { AuthService } from 'src/app/Services/auth.service';
import { FrightpricesService } from 'src/app/Services/frightprices.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { FrightPricesStaticData, ProgrssBar, Tools } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { threadId } from 'worker_threads';
import { FrightPriceUpdateComponent } from '../fright-price-update/fright-price-update.component';

@Component({
  selector: 'app-fright-prices',
  templateUrl: './fright-prices.component.html',
  styleUrls: ['./fright-prices.component.sass']
})
export class FrightPricesComponent implements OnInit {

  FrightPricesList: frightPrices[] = [];

  progressRef: any
  constructor(private FirghtpricesSer: FrightpricesService,
   private Progress: NgProgress,
   private notification: NotificationserService,
   private router: Router,
   private dialog: MatDialog,
   private AuthSer: AuthService,
   ) { }

  ngOnInit(): void {
    this.progressRef = this.Progress.ref('myProgress');
    this.GetFrightPrices();
    this.FrightPricesList = FrightPricesStaticData;
     this.AuthSer.GetRole();

  }
  UpdateSinglePrice(FrightPriceToUpdate: frightPrices){
    this.dialog.open(FrightPriceUpdateComponent,{
      height: '30rem',
      width: '40rem',
      data: FrightPriceToUpdate
    })
  }

  GetFrightPrices(){
    ProgrssBar( this.FirghtpricesSer.GetAllFrightPrices().then((res: any) => {
      this.FrightPricesList = res ?? [];
    },(err:any) =>{
      Auth_error_handling(err, this.progressRef, this.notification, this.router)
    }),this.progressRef)
  }

   CheckRole(){
    return (localStorage.getItem('Role') == ("Admin" ||"Alfemo")) ? true: false;
  }
}
