import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/Notificationser.service';
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
    ShippingDocs: "",
    comments: "",
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
    if(!sessionStorage.getItem('token')){
      this.router.navigateByUrl('/LogIn')
    }else{
      this.PoToUpdate = this.data;
      this.UpdatedPo.get('Status')?.setValue(this.data.status);
      this.UpdatedPo.get('ContainerNumber')?.setValue(this.data.containerNumber);
      this.UpdatedPo.get('FinalDestination')?.setValue(this.data.finalDestLocation);
      this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.setValue(this.data.factoryEstimatedArrivalDate);
      this.UpdatedPo.get('FactoryEstimatedShipDate')?.setValue(this.data.factoryEstimatedShipDate);
  
      this.UpdatedPo.setValue({
        Status: this.data.status,
        ContainerNumber: this.data.containerNumber,
        FinalDestination: this.data.finalDestLocation,
        FactoryEstimatedArrivalDate: this.data.factoryEstimatedArrivalDate,
        FactoryEstimatedShipDate: this.data.factoryEstimatedShipDate
      })
    }
  }

  Update(){
    this.PoToUpdate.status = this.UpdatedPo.get('Status')?.value;
    this.PoToUpdate.containerNumber = this.UpdatedPo.get('ContainerNumber')?.value;
    this.PoToUpdate.finalDestLocation = this.UpdatedPo.get('FinalDestination')?.value;
    this.PoToUpdate.factoryEstimatedArrivalDate = this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.value;
    this.PoToUpdate.factoryEstimatedShipDate = this.UpdatedPo.get('FactoryEstimatedShipDate')?.value;
    
    let fd = new FormData();
    if(this.SeletedFile){

      let extenstion: string = this.SeletedFile.name;
      extenstion = extenstion.substring(extenstion.lastIndexOf('.'));

      this.PoToUpdate.ShippingDocs = "SD_" + this.PoToUpdate.dealerPONumber + "_" + this.PoToUpdate.corinthianPO + extenstion;

      //let FileToUpload : File = new File(this.SeletedFile,this.PoToUpdate.ShippingDocs)
      

      fd.append('PO',this.SeletedFile,this.PoToUpdate.ShippingDocs);

      
      this.PoService.Uploadfile(fd,this.PoToUpdate.ShippingDocs).toPromise().then((res: any) => {
        if(res  == true){
          this.Notification.OnSuccess("You Uploaded Your File successfully")
        }else{
          this.Notification.OnError("The File Was Not Uploaded Please Try Again Later")
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
    })
    
  }
  
  UploadPo(event: any) {
    this.SeletedFile = event.target.files[0];
  }
  Close(){
    this.dialogref.close();
  }
}
