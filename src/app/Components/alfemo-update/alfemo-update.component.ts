import { Component, Inject, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { AddPreffixAndExtention, Spinner, UploadFile } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';

@Component({
  selector: 'app-alfemo-update',
  templateUrl: './alfemo-update.component.html',
  styleUrls: ['./alfemo-update.component.css']
})
export class AlfemoUpdateComponent implements OnInit {

  UpdatedPo = new FormGroup({
    Status: new FormControl(''),
    ContainerNumber: new FormControl(''),
    FinalDestination: new FormControl(''),
    FactoryEstimatedArrivalDate: new FormControl(''),
    FactoryEstimatedShipDate: new FormControl(''),
    AlfemoComents: new FormControl('')
  })

  PoToUpdate: POs = new POs();

  SeletedFile: any;

  constructor(private PoService: POsService,
    private Notification: NotificationserService,
    private dialogref: MatDialogRef<AlfemoUpdateComponent>,
    private router: Router,
    private spinner: Spinner, 
    @Inject(MAT_DIALOG_DATA) public data: POs) { }

  ngOnInit(): void {
    CheckToken(this.router);
    this.PoToUpdate = this.data;
    this.NotifyIfShippingDocsExist();
    this.AssignPoDataToForm();
  }

  NotifyIfShippingDocsExist(){
    if(this.PoToUpdate.shippingDocs != ""){
      this.Notification.DisplayInfo("You Already Uploaded A ShippingDocs ")
    }
  }

  AssignPoDataToForm(){
    this.UpdatedPo.setValue({
      Status: this.data.status,
      ContainerNumber: this.data.containerNumber,
      FinalDestination: this.data.finalDestLocation,
      FactoryEstimatedArrivalDate: this.data.factoryEstimatedArrivalDate,
      FactoryEstimatedShipDate: this.data.factoryEstimatedShipDate,
      AlfemoComents: this.data.alfemoComments
    })
  }

  
  Submit() {    
    this.AssignformValuesToObject();

    if (this.SeletedFile) {  
      let UploadProcess: any;
      (async () => {
        UploadProcess = await UploadFile(this.PoService, this.ConstructFormDataFile(), this.ConstructFileName(), this.Notification, this.spinner, this.router)
        if (UploadProcess == true) {
          this.UpdatePo();
        }
      })();
    } else {
      this.UpdatePo();
    }
  }
  UpdatePo(){
    if(this.UpdatedPo.get('Status')?.value == "Shipped" && !this.SeletedFile){
      this.Notification.OnError("You have to Upload a shipping Document when the status is: Shipped")
    }else{
        this.spinner.WrapWithSpinner( this.PoService.UpdatePo(this.PoToUpdate).toPromise().then((res: any) => {
          if (res == true) {
            this.Notification.OnSuccess("You Updated the Po successfully")
            this.Close()
          } else {
            this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
          }
        }, (err: any) => {
          Auth_error_handling(err, this.Notification, this.router)
        }),this.dialogref)
      }
    }

  ConstructFileName(){
    let FileName = this.PoToUpdate.dealerPONumber + "_" + this.PoToUpdate.corinthianPO;
    FileName = AddPreffixAndExtention("SD_", FileName, this.SeletedFile.name)

    return FileName
  }
  ConstructFormDataFile(){
    let fd = new FormData();
    this.PoToUpdate.shippingDocs = this.ConstructFileName();
    fd.append('PO', this.SeletedFile, this.ConstructFileName());
    return fd;
  }
  SaveFileInObject(event: any) {
    this.SeletedFile = event.target.files[0];
  }

  Close() {
    this.dialogref.close();
  }
  AssignformValuesToObject(){
    this.PoToUpdate.status = this.UpdatedPo.get('Status')?.value;
    this.PoToUpdate.containerNumber = this.UpdatedPo.get('ContainerNumber')?.value;
    this.PoToUpdate.finalDestLocation = this.UpdatedPo.get('FinalDestination')?.value;
    this.PoToUpdate.factoryEstimatedArrivalDate = this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.value;
    this.PoToUpdate.factoryEstimatedShipDate = this.UpdatedPo.get('FactoryEstimatedShipDate')?.value;
    this.PoToUpdate.alfemoComments = this.UpdatedPo.get('AlfemoComents')?.value;
  }
  AssignValidators(event:any){
    if(event.target.value == "Shipped"){
      alert("you have to fill the following fields to update this Po:\n 1 - EstimatedArrivalDate\n 2 - EstimatedShipDate\n 3 - container no\n 4 - Shipping Document")
      this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.setValidators(Validators.required);
      this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.updateValueAndValidity();
      this.UpdatedPo.get('FactoryEstimatedShipDate')?.setValidators(Validators.required);
      this.UpdatedPo.get('FactoryEstimatedShipDate')?.updateValueAndValidity();
      this.UpdatedPo.get('ContainerNumber')?.setValidators(Validators.required);
      this.UpdatedPo.get('ContainerNumber')?.updateValueAndValidity();
      this.UpdatedPo.get('FinalDestination')?.setValidators(Validators.required);
      this.UpdatedPo.get('FinalDestination')?.updateValueAndValidity();
      
    }else{
      this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.clearValidators()
      this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.updateValueAndValidity();
      this.UpdatedPo.get('FactoryEstimatedShipDate')?.clearValidators()
      this.UpdatedPo.get('FactoryEstimatedShipDate')?.updateValueAndValidity();
      this.UpdatedPo.get('ContainerNumber')?.clearValidators()
      this.UpdatedPo.get('ContainerNumber')?.updateValueAndValidity();
      this.UpdatedPo.get('FinalDestination')?.clearValidators();
      this.UpdatedPo.get('FinalDestination')?.updateValueAndValidity();
      
    }
  }
}
