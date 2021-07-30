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
import { AddPreffixAndExtention, AdjustingDataForDisplay, Directories, DownLoadFile, UploadFile } from 'src/app/Utilities/Common';
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


  CurrentPo: POs = new POs();
  SeletedFile: any;
  progressRef: any;

  constructor(private PoService: POsService,
    private Notification: NotificationserService,
    private progress: NgProgress,
    private dialogref: MatDialogRef<AdminReviewComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: POs) { }

  ngOnInit(): void {
    CheckToken(this.router);
    this.CurrentPo = this.data;
    if (this.CurrentPo.mackPOAttach == "") {
      this.MackFile = false;
    } else {
      this.MackFile = true
    }
    if (this.CurrentPo.shippingDocs == "") {
      this.ShipFile = false
    } else {
      this.ShipFile = true
    }
    if (this.CurrentPo.corinthianPOAttach == "") {
      this.CorintatinFile = false
    } else {
      this.CorintatinFile = true
    }

    this.progressRef = this.progress.ref('PopUProgress');

  }

  Approve() {
    this.CurrentPo.approvalStatus = true;
    window.alert("you need to hit Apply changes to Complete the process");
  }

  Cancel() {
    this.CurrentPo.approvalStatus = false;
    window.alert("you need to hit Apply changes to Complete the process");

  }

  Submit() {
    this.progressRef.start();

    let fd = new FormData();

    if (this.SeletedFile) {
      let FileName = this.CurrentPo.dealerPONumber + "_" + this.CurrentPo.corinthianPO;
      FileName = AddPreffixAndExtention("MP_", FileName, this.SeletedFile.name)

      this.CurrentPo.mackPOAttach = FileName

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

  DownloadShippingDocs() {
    let FileName = this.CurrentPo.shippingDocs;
    DownLoadFile(Directories.ShippingDocument, FileName);
  }

  DownloadMackPo() {
    let FileName = this.CurrentPo.mackPOAttach;
    DownLoadFile(Directories.MackPo, FileName);
  }
  DownLoadCorinthainPo() {
    let FileName = this.CurrentPo.corinthianPOAttach
    DownLoadFile(Directories.CorinthainPo, FileName);
  }

  Close() {
    this.dialogref.close();
  }
  UpdatePo() {
    this.PoService.UpdatePo(this.CurrentPo).toPromise().then((res: any) => {
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
  }
  AdjustingDataForDisplay(approvalStatus: boolean) {
    return AdjustingDataForDisplay(approvalStatus);
  }
}
