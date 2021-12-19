import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { freightPrices } from 'src/app/Models/frightPrices';
import { FrightpricesService } from 'src/app/Services/frightprices.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';

@Component({
  selector: 'app-create-feight-price',
  templateUrl: './create-feight-price.component.html',
  styleUrls: ['./create-feight-price.component.sass']
})
export class CreateFeightPriceComponent implements OnInit {

  CreateFreightPriceForm = new FormGroup(
    {
      Location: new FormControl('',Validators.required),
      Price: new FormControl('',Validators.required),
      DeliveryType: new FormControl('',Validators.required),
      Port: new FormControl('',Validators.required)
    }
  )
  NewFreidghtPrice: freightPrices = new freightPrices();
  constructor(
    private spinner: Spinner,
    private FrightPriceSer:FrightpricesService,
    private notification : NotificationserService,
    private router: Router,
    private dialogref: MatDialogRef<CreateFeightPriceComponent>
  ) { }

  ngOnInit(): void {
  }
  Submit(){
    this.AssignFormValuesToFrightPriceObject();
    this.CreateFreightPrice(this.NewFreidghtPrice);
  }
  
  CreateFreightPrice(FrightPriceToUpdate: freightPrices){
    this.spinner.WrapWithSpinner (this.FrightPriceSer.AddFrightPrice(FrightPriceToUpdate).then((res: any) =>{
        this.notification.OnSuccess(res)
        location.reload();
        this.Close();
      
    },(err: any) =>{
      Auth_error_handling(err,this.notification,this.router);
    }))
  }
  
  AssignFormValuesToFrightPriceObject(){
    this.NewFreidghtPrice.locations =  this.CreateFreightPriceForm.get('Location')?.value;
    this.NewFreidghtPrice.currentprice = this.CreateFreightPriceForm.get('Price')?.value;
    this.NewFreidghtPrice.deliveryType = this.CreateFreightPriceForm.get('DeliveryType')?.value;
    this.NewFreidghtPrice.port = this.CreateFreightPriceForm.get('Port')?.value;
    this.NewFreidghtPrice.changedon = new Date().toLocaleDateString()
  }

  Close(){
    this.dialogref.close();
  }

}
