import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import { POs } from 'src/app/Models/Po-model';
import { POsService } from 'src/app/Services/pos.service';
import { NotificationserService } from 'src/app/Services/Notificationser.service';
@Component({
  selector: 'app-admin-review',
  templateUrl: './admin-review.component.html',
  styleUrls: ['./admin-review.component.css']
})
export class AdminReviewComponent implements OnInit {

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

  mydata: POs[] = [];
  
  SeletedFile: any;

  constructor(private PoService: POsService,
    private Notification: NotificationserService,
    private dialogref: MatDialogRef<AdminReviewComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: POs) { }

  ngOnInit(): void {
    if (!sessionStorage.getItem('token')) {
      this.router.navigateByUrl('/LogIn')
    } else {
      this.mydata[0] = this.data;
    }
  }
  
  Approve() {
    this.mydata[0].approvalStatus = true;
  }

  Cancel() {
    this.mydata[0].approvalStatus = false;

  }

  UpdatePo() {

    let fd = new FormData();
    if(this.SeletedFile){
      let extenstion: string = this.SeletedFile.name;
      extenstion = extenstion.substring(extenstion.lastIndexOf('.'));

      this.mydata[0].mackPOAttach = "MP_" + this.mydata[0].dealerPONumber + "_" + this.mydata[0].corinthianPO + extenstion;

      //let FileToUpload : File = new File(this.SeletedFile,this.mydata[0].mackPOAttach)

      fd.append('PO',this.SeletedFile,this.mydata[0].mackPOAttach);
  
      this.PoService.Uploadfile(fd,this.mydata[0].mackPOAttach).subscribe((res) => {
        if(res  == true){
          this.Notification.OnSuccess("You Uploaded Your File successfully")
        }else{
          this.Notification.OnError("The File Was Not Uploaded Please Try Again Later")
        }
      })
    }

    this.PoService.UpdatePo(this.mydata[0]).toPromise().then( (res : any) => {
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

  DownLoadPo(PoType: string){
    let href: string = "";
    let FileName: string = "";
    if(PoType == "Mack"){
       href  =  "MP/" + this.mydata[0].mackPOAttach ;
       FileName = this.mydata[0].mackPOAttach;
    }else{
      if(PoType == "ShippingDocs"){
        console.log(this.mydata[0].ShippingDocs)
        href = "SD/" + this.mydata[0].ShippingDocs;
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
}
