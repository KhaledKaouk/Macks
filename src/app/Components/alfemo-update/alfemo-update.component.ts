import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';

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


  constructor(private PoService: POsService,
    private Notification: NotificationserService,
    private dialogref: MatDialogRef<AlfemoUpdateComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: POs ) { }

  ngOnInit(): void {
    if(!localStorage.getItem('token')){
      this.router.navigateByUrl('/LogIn')
    }else{
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
  }

  Update(){
    console.log('qweq')
    this.PoToUpdate.status = this.UpdatedPo.get('Status')?.value;
    this.PoToUpdate.containerNumber = this.UpdatedPo.get('ContainerNumber')?.value;
    this.PoToUpdate.finalDestLocation = this.UpdatedPo.get('FinalDestination')?.value;
    this.PoToUpdate.factoryEstimatedArrivalDate = this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.value;
    this.PoToUpdate.factoryEstimatedShipDate = this.UpdatedPo.get('FactoryEstimatedShipDate')?.value;
    this.PoToUpdate.alfemoComments = this.UpdatedPo.get('AlfemoComents')?.value;
    let fd = new FormData();
    if(this.SeletedFile){

      let extenstion: string = this.SeletedFile.name;
      extenstion = extenstion.substring(extenstion.lastIndexOf('.'));

      this.PoToUpdate.shippingDocs = "SD_" + this.PoToUpdate.dealerPONumber + "_" + this.PoToUpdate.corinthianPO + extenstion;      

      fd.append('PO',this.SeletedFile,this.PoToUpdate.shippingDocs);
      
      this.PoService.Uploadfile(fd,this.PoToUpdate.shippingDocs).toPromise().then((res: any) => {
        if(res  == true){
          this.Notification.OnSuccess("You Uploaded your file successfuly")
        }else{
          this.Notification.OnError("The File Was Not Uploaded Please Try Again Later")
        }
      },(err:any) => {
        if (err.error.message == "Authorization has been denied for this request."){
          localStorage.clear();
          this.router.navigateByUrl('/LogIn')
        }else{
          this.Notification.OnError('try again later or login again')
        }
      })
      
    }
    this.PoService.UpdatePo(this.PoToUpdate).toPromise().then((res: any) =>{
      if(res  == true){
        this.Notification.OnSuccess("You Updated the Po successfully")
        this.Close()
      }else{
        this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
      }
    },(err:any) => {
      if (err.error.message == "Authorization has been denied for this request."){
        localStorage.clear();
        this.router.navigateByUrl('/LogIn')
      }else{
        this.Notification.OnError('try again later or login again')
      }
    })
  }
  
  UploadPo(event: any) {
    this.SeletedFile = event.target.files[0];
  }
  Close(){
    this.dialogref.close();
  }
}
