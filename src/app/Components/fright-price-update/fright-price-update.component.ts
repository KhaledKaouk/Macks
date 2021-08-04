import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { frightPrices } from 'src/app/Models/frightPrices';
import { FrightpricesService } from 'src/app/Services/frightprices.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { ProgrssBar } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';

@Component({
  selector: 'app-fright-price-update',
  templateUrl: './fright-price-update.component.html',
  styleUrls: ['./fright-price-update.component.sass']
})
export class FrightPriceUpdateComponent implements OnInit {

  progressRef: any
  ToUpdateFrightPrice: frightPrices = new frightPrices();

  UpdateFrightPriceForm = new FormGroup(
    {
      Location: new FormControl({value: this.data.locations, disabled: true},Validators.required),
      Price: new FormControl('',Validators.required)
    }
  )
  constructor(@Inject(MAT_DIALOG_DATA) public data: frightPrices,
  private dialogref: MatDialogRef<FrightPriceUpdateComponent>,
  private FrightPriceSer: FrightpricesService,
  private notification : NotificationserService,
  private router: Router,
  private Progress: NgProgress) { }

  ngOnInit(): void {
    this.progressRef = this.Progress.ref('PopUpProgressBar')
    this.UpdateFrightPriceForm.setValue({
      Location: this.data.locations,
      Price:  this.data.currentprice
    });
  }

  Submit(){
    this.AssignFormValuesToObject();
    this.UpdateFrightPrice(this.ToUpdateFrightPrice);
  }
  
  UpdateFrightPrice(FrightPriceToUpdate: frightPrices){
    ProgrssBar (this.FrightPriceSer.UpdateSinglefrightPrice(FrightPriceToUpdate).then((res: any) =>{
        this.notification.OnSuccess(res)
        this.Close();
      
    },(err: any) =>{
      Auth_error_handling(err,this.progressRef,this.notification,this.router);
    }),this.progressRef)
  }
  
  AssignFormValuesToObject(){
    this.ToUpdateFrightPrice.id = this.data.id;
    this.ToUpdateFrightPrice.locations =  this.UpdateFrightPriceForm.get('Location')?.value;
    this.ToUpdateFrightPrice.currentprice = this.UpdateFrightPriceForm.get('Price')?.value;
    this.ToUpdateFrightPrice.oldprice = this.data.currentprice;
    this.ToUpdateFrightPrice.changedon = new Date().toLocaleDateString()
  }
  
  Close(){
    this.dialogref.close();
  }
}
