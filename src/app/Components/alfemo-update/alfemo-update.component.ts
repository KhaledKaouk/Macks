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
import { AddPreffixAndExtention, UploadFile } from 'src/app/Utilities/Common';
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
  progressRef: any;

  constructor(private PoService: POsService,
    private Notification: NotificationserService,
    private progress: NgProgress,
    private dialogref: MatDialogRef<AlfemoUpdateComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: POs) { }

  ngOnInit(): void {
    CheckToken(this.router);
    this.progressRef = this.progress.ref('PopUProgress');

    this.PoToUpdate = this.data;
    if(this.PoToUpdate.shippingDocs != ""){
      alert("You Already Updated A Shipping Document for this Po")
    }
/*     this.UpdatedPo.get('Status')?.setValue(this.data.status);
    this.UpdatedPo.get('ContainerNumber')?.setValue(this.data.containerNumber);
    this.UpdatedPo.get('FinalDestination')?.setValue(this.data.finalDestLocation);
    this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.setValue(this.data.factoryEstimatedArrivalDate);
    this.UpdatedPo.get('FactoryEstimatedShipDate')?.setValue(this.data.factoryEstimatedShipDate);
    this.UpdatedPo.get('AlfemoComents')?.setValue(this.data.alfemoComments)
 */
    this.UpdatedPo.setValue({
      Status: this.data.status,
      ContainerNumber: this.data.containerNumber,
      FinalDestination: this.data.finalDestLocation,
      FactoryEstimatedArrivalDate: this.data.factoryEstimatedArrivalDate,
      FactoryEstimatedShipDate: this.data.factoryEstimatedShipDate,
      AlfemoComents: this.data.alfemoComments
    })
  }

  Update() {
    this.progressRef.start();
    
    this.AssignformValuesToObject();

    let fd = new FormData();
    
    if (this.SeletedFile) {
      let FileName = this.PoToUpdate.dealerPONumber + "_" + this.PoToUpdate.corinthianPO;
      FileName = AddPreffixAndExtention("SD_", FileName, this.SeletedFile.name)

      this.PoToUpdate.shippingDocs = FileName;

      fd.append('PO', this.SeletedFile, FileName);

      let UploadProcess: any;
      (async () => {
        UploadProcess = await UploadFile(this.PoService, fd, FileName, this.Notification, this.progressRef, this.router)
        if (UploadProcess == true) {
          this.UpdatePo();
        }
      })();
    } else {
      this.UpdatePo();
    }
  }

  UploadPo(event: any) {
    this.SeletedFile = event.target.files[0];
  }
  Close() {
    this.dialogref.close();
  }
  UpdatePo(){
    if(this.UpdatedPo.get('Status')?.value == "Shipped"){
      if(this.SeletedFile){
        this.PoService.UpdatePo(this.PoToUpdate).toPromise().then((res: any) => {
          if (res == true) {
            this.progressRef.complete();
            this.Notification.OnSuccess("You Updated the Po successfully")
            this.Close()
          } else {
            this.progressRef.complete();
            this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
          }
        }, (err: any) => {
          Auth_error_handling(err, this.progressRef, this.Notification, this.router)
        })
      }else{
        this.progressRef.complete();
        this.Notification.OnError("You have to Upload a shipping Document when the status is: Shipped")
      }
    }
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
    }else{
      this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.clearValidators()
      this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.updateValueAndValidity();
      this.UpdatedPo.get('FactoryEstimatedShipDate')?.clearValidators()
      this.UpdatedPo.get('FactoryEstimatedShipDate')?.updateValueAndValidity();
      this.UpdatedPo.get('ContainerNumber')?.clearValidators()
      this.UpdatedPo.get('ContainerNumber')?.updateValueAndValidity();
      
    }
  }
}
