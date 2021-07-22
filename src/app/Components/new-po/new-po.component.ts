import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/Notificationser.service';
import { POsService } from 'src/app/Services/pos.service';

@Component({
  selector: 'app-new-po',
  templateUrl: './new-po.component.html',
  styleUrls: ['./new-po.component.sass']
})
export class NewPoComponent implements OnInit {



  NewPo: POs = {
    id: 0,
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
  CreatePo = new FormGroup({
    DealerName: new FormControl('', Validators.required),
    DealerPo: new FormControl('', Validators.required),
    CorinthainPo: new FormControl('', Validators.required),
    ProductionRequestDate: new FormControl('', Validators.required),
    Comments: new FormControl('')
  })

  SeletedFile: any;

  constructor(private Pos: POsService,
    private Notification: NotificationserService,
    private router: Router) { }

  ngOnInit(): void {
    if (!sessionStorage.getItem('token')) {
      this.router.navigateByUrl('/LogIn')
    }
  }


  UploadPo(event: any) {
    this.SeletedFile = event.target.files[0];

  }

  Submit() {
    this.NewPo.dealerName = this.CreatePo.get("DealerName")?.value;
    this.NewPo.dealerPONumber = this.CreatePo.get("DealerPo")?.value;
    this.NewPo.corinthianPO = this.CreatePo.get("CorinthainPo")?.value;
    this.NewPo.productionRequestDate = this.CreatePo.get("ProductionRequestDate")?.value;
    this.NewPo.comments = this.CreatePo.get("Comments")?.value;
    this.NewPo.corinthianPOAttach = this.NewPo.dealerName + this.NewPo.corinthianPO;

    let fd = new FormData();
    if (this.SeletedFile) {
      let extenstion: string = this.SeletedFile.name;
      extenstion = extenstion.substring(extenstion.lastIndexOf('.'));

      this.NewPo.corinthianPOAttach = "NP_" + this.NewPo.dealerPONumber + "_" + this.NewPo.corinthianPO + extenstion;
      
      //let FileToUpload : File = new File(this.SeletedFile,this.NewPo.corinthianPOAttach)

      fd.append('PO', this.SeletedFile, this.NewPo.corinthianPOAttach);

      let ReDirecting: boolean[] = [false, false]

      this.Pos.Uploadfile(fd, this.NewPo.corinthianPOAttach).toPromise().then((res: any) => {
        if (res == true) {
          ReDirecting[0] = true;
          this.Pos.CreatePo(this.NewPo).toPromise().then((res: any) => {
            if (res == true) {
              ReDirecting[1] = true;
              this.Notification.OnSuccess("You Updated the Po successfully")
            } else {
              this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
            }
          })
        } else {
          this.Notification.OnError("The File Was Not Uploaded Please Try Again Later")
        }
      });
      if (ReDirecting[0] == true && ReDirecting[1] == true) {
        this.router.navigateByUrl('/MyPos')
      }
    }
     else {
      this.Notification.OnError('Please Select A Po To Upload')
    }
  }
}
