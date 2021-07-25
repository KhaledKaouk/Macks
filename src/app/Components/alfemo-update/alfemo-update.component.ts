import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { AddPreffixAndExtention } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';

@Component({
  selector: 'app-alfemo-update',
  templateUrl: './alfemo-update.component.html',
  styleUrls: ['./alfemo-update.component.css']
})
export class AlfemoUpdateComponent implements OnInit {

  UpdatedPo= new FormGroup({
    Status: new FormControl(''),
    ContainerNumber: new FormControl(''),
    FinalDestination: new FormControl(''),
    FactoryEstimatedArrivalDate: new FormControl(''),
    FactoryEstimatedShipDate: new FormControl(''),
    AlfemoComents: new FormControl('')
  })

  PoToUpdate: POs = {
    id: 1,
    dealerName: "",
    dealerPONumber: "",
    mackPONumber: "",
    corinthianPO: "",
    itemID: 0,
    supplierName: "",
    userID: "",
    mackPOAttach: "",
    corinthianPOAttach: "",
    shippingDocs: "",
    comments: "",
    alfemoComments:"",
    status: "",
    productionRequestDate: "",
    factoryEstimatedShipDate: "",
    dateReceived: "",
    factoryEstimatedArrivalDate: "",
    booked: false,
    finalDestLocation: "",
    containerNumber: "",
    productionRequestTime: "",
    approvalStatus: false  
  }

  SeletedFile: any;
  progressRef: any;

  constructor(private PoService: POsService,
    private Notification: NotificationserService,
    private progress:NgProgress,
    private dialogref: MatDialogRef<AlfemoUpdateComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: POs ) { }

  ngOnInit(): void {
    CheckToken(this.router);
      this.progressRef = this.progress.ref('myProgress');

      this.PoToUpdate = this.data;
      this.UpdatedPo.get('Status')?.setValue(this.data.status);
      this.UpdatedPo.get('ContainerNumber')?.setValue(this.data.containerNumber);
      this.UpdatedPo.get('FinalDestination')?.setValue(this.data.finalDestLocation);
      this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.setValue(this.data.factoryEstimatedArrivalDate);
      this.UpdatedPo.get('FactoryEstimatedShipDate')?.setValue(this.data.factoryEstimatedShipDate);
      this.UpdatedPo.get('AlfemoComents')?.setValue(this.data.alfemoComments)

      this.UpdatedPo.setValue({
        Status: this.data.status,
        ContainerNumber: this.data.containerNumber,
        FinalDestination: this.data.finalDestLocation,
        FactoryEstimatedArrivalDate: this.data.factoryEstimatedArrivalDate,
        FactoryEstimatedShipDate: this.data.factoryEstimatedShipDate,
        AlfemoComents: this.data.alfemoComments
      })
  }

  Update(){
    this.progressRef.start();
    this.PoToUpdate.status = this.UpdatedPo.get('Status')?.value;
    this.PoToUpdate.containerNumber = this.UpdatedPo.get('ContainerNumber')?.value;
    this.PoToUpdate.finalDestLocation = this.UpdatedPo.get('FinalDestination')?.value;
    this.PoToUpdate.factoryEstimatedArrivalDate = this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.value;
    this.PoToUpdate.factoryEstimatedShipDate = this.UpdatedPo.get('FactoryEstimatedShipDate')?.value;
    this.PoToUpdate.alfemoComments = this.UpdatedPo.get('AlfemoComents')?.value;

    let fd = new FormData();
    if(this.SeletedFile){
      let FileName = this.PoToUpdate.dealerPONumber + "_" + this.PoToUpdate.corinthianPO;
      FileName =  AddPreffixAndExtention("SD_",FileName,this.SeletedFile.name)

      this.PoToUpdate.shippingDocs = FileName;

      fd.append('PO',this.SeletedFile,FileName);
      
      this.PoService.Uploadfile(fd,this.PoToUpdate.shippingDocs).toPromise().then((res: any) => {
        if(res  == true){
          this.PoService.UpdatePo(this.PoToUpdate).toPromise().then((res: any) =>{
            if(res  == true){
              this.progressRef.complete();
              this.Notification.OnSuccess("You Updated the Po successfully")
              this.Close()
            }else{
              this.progressRef.complete();
              this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
            }
          },(err:any) => {
            Auth_error_handling(err,this.progressRef,this.Notification,this.router)
          })
        }else{
          this.progressRef.complete();
          this.Notification.OnError("The File Was Not Uploaded Please Try Again Later")
        }
      },(err:any) => {
        Auth_error_handling(err,this.progressRef,this.Notification,this.router)
      })
      
    }else{
      this.PoService.UpdatePo(this.PoToUpdate).toPromise().then((res: any) =>{
        if(res  == true){
          this.progressRef.complete();
          this.Notification.OnSuccess("You Updated the Po successfully")
          this.Close()
        }else{
          this.progressRef.complete();
          this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
        }
      },(err:any) => {
        Auth_error_handling(err,this.progressRef,this.Notification,this.router)
      })
    }
  }
  
  UploadPo(event: any) {
    this.SeletedFile = event.target.files[0];
  }
  Close(){
    this.dialogref.close();
  }
}
