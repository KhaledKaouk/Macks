import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { freightPrices } from 'src/app/Models/frightPrices';
import { FrightpricesService } from 'src/app/Services/frightprices.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import {  Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';

@Component({
  selector: 'app-fright-price-update',
  templateUrl: './fright-price-update.component.html',
  styleUrls: ['./fright-price-update.component.sass']
})
export class FrightPriceUpdateComponent implements OnInit {

  ToUpdateFrightPrice: freightPrices = new freightPrices();

  UpdateFrightPriceForm = new FormGroup(
    {
      Location: new FormControl({value: this.data.City, disabled: true},Validators.required),
      Price: new FormControl('',Validators.required),
      DeliveryType: new FormControl('',Validators.required),
      Port: new FormControl('',Validators.required)
    }
  )
  constructor(@Inject(MAT_DIALOG_DATA) public data: freightPrices,
  private dialogref: MatDialogRef<FrightPriceUpdateComponent>,
  private FrightPriceSer: FrightpricesService,
  private notification : NotificationserService,
  private router: Router,
  private spinner: Spinner) { }

  ngOnInit(): void {
    this.AssignFrightPriceInfoToForm();
  }

  Submit(){
    this.AssignFormValuesToFrightPriceObject();
    this.UpdateFrightPrice(this.ToUpdateFrightPrice);
  }
  
  UpdateFrightPrice(FrightPriceToUpdate: freightPrices){
    this.spinner.WrapWithSpinner (this.FrightPriceSer.UpdateSinglefrightPrice(FrightPriceToUpdate).then((res: any) =>{
        this.notification.OnSuccess(res)
        location.reload();
        this.Close();
      
    },(err: any) =>{
      Auth_error_handling(err,this.notification,this.router);
    }))
  }
  
  AssignFormValuesToFrightPriceObject(){
    this.ToUpdateFrightPrice._id = this.data._id;
    this.ToUpdateFrightPrice.City =  this.UpdateFrightPriceForm.get('Location')?.value;
    this.ToUpdateFrightPrice.PortToPortPrice = this.UpdateFrightPriceForm.get('Price')?.value;
    // this.ToUpdateFrightPrice.deliveryType = this.UpdateFrightPriceForm.get('DeliveryType')?.value;
    // this.ToUpdateFrightPrice.oldprice = this.data.currentprice;
    this.ToUpdateFrightPrice.Port = this.UpdateFrightPriceForm.get('Port')?.value;
    this.ToUpdateFrightPrice.Validty = ""
  }
  AssignFrightPriceInfoToForm(){
    this.UpdateFrightPriceForm.setValue({
      Location: this.data.City,
      Price:  this.data.PortToPortPrice,
      DeliveryType: "Door Delivery",
      Port: this.data.Port
    });
  }
  
  Close(){
    this.dialogref.close();
  }
}
