import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import { POs } from 'src/app/Models/Po-model';
import { POsService } from 'src/app/Services/pos.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { NgProgress } from 'ngx-progressbar';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { AddPreffixAndExtention, UploadFile } from 'src/app/Utilities/Common';
@Component({
  selector: 'app-admin-review',
  templateUrl: './admin-review.component.html',
  styleUrls: ['./admin-review.component.css']
})
export class AdminReviewComponent implements OnInit {

  MackFile: boolean = true;
  ShipFile: boolean = true;
  CorintatinFile: boolean = true;

  ShowRowNumber: boolean = true;
  ShowDealerName: Boolean = true;
  ShowCorinthainPoNo: boolean = true;
  ShowDate: boolean = true;
  ShowStatus: boolean = true;
  ShowApproved: boolean = true;



  testingthemodel: POs = {
    id: 1,
    dealerName: "",
    dealerPONumber: "",
    mackPONumber: "",
    corinthianPO: "",
    itemID: 0,
    supplierName: "null",
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

  mydata: POs[] = [];
  MiddlePo: POs = new POs();
  SeletedFile: any;
  progressRef: any;

  constructor(private PoService: POsService,
    private Notification: NotificationserService,
    private progress:NgProgress,
    private dialogref: MatDialogRef<AdminReviewComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: POs) { }

  ngOnInit(): void {
    CheckToken(this.router);
      this.mydata[0] = this.data;
      if(this.mydata[0].mackPOAttach == ""){
        this.MackFile = false;
      }else{
        this.MackFile = true
      }
      if(this.mydata[0].shippingDocs == ""){
        this.ShipFile = false 
      }else{
        this.ShipFile = true
      }
      if(this.mydata[0].corinthianPOAttach == ""){
        this.CorintatinFile = false
      }else{
        this.CorintatinFile = true
      }

    this.progressRef = this.progress.ref('myProgress');

  }
  
  Approve() {
    this.MiddlePo.approvalStatus = true;
  }

  Cancel() {
    this.MiddlePo.approvalStatus = false;

  }

  Submit() {
    this.progressRef.start();

    let fd = new FormData();
    this.mydata[0].approvalStatus = this.MiddlePo.approvalStatus;

    if(this.SeletedFile){
      let FileName = this.mydata[0].dealerPONumber + "_" + this.mydata[0].corinthianPO;
      FileName = AddPreffixAndExtention("MP_",FileName,this.SeletedFile.name)

      this.mydata[0].mackPOAttach = FileName

      fd.append('PO',this.SeletedFile,FileName);
  
      let UploadProcess: any;
      (async () => {
        UploadProcess = await UploadFile(this.PoService, fd, FileName, this.Notification, this.progressRef, this.router)
        if (UploadProcess == true) {
          this.UpdatePo();
        }
      })();
    }else{
      this.UpdatePo();
    }


  }

  UploadPo(event: any) {
    this.SeletedFile = event.target.files[0];
  }

  DownLoadPo(PoType: string){
    let href: string = "";
    let FileName: string = "";
    if(PoType == "Mack"){
       href  =  "MP/" + this.mydata[0].mackPOAttach ;
       FileName = this.mydata[0].mackPOAttach;
    }else{
      if(PoType == "ShippingDocs"){
        console.log(this.mydata[0].shippingDocs)
        href = "SD/" + this.mydata[0].shippingDocs;
        FileName = this.mydata[0].corinthianPOAttach;
      }else{
        href = "NP/" + this.mydata[0].corinthianPOAttach;
        FileName = this.mydata[0].corinthianPOAttach;
      }
    }
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'https://macksdistribution.com/Attatchments/' + href);
    link.setAttribute('download', FileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  Close() {
    this.dialogref.close();
  }
  UpdatePo(){
    this.PoService.UpdatePo(this.mydata[0]).toPromise().then( (res : any) => {
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
