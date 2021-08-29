import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { rejects } from 'assert';
import { NgProgress } from 'ngx-progressbar';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { AddPreffixAndExtention, AdjustingDataForDisplay, Directories, DownLoadFile, Functionalities, HideDialog, ProgrssBar, RemoveSlashes, ShowDialog, Spinner, UploadFile } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { AlfemoUpdateComponent } from '../alfemo-update/alfemo-update.component';

@Component({
  selector: 'app-po-details',
  templateUrl: './po-details.component.html',
  styleUrls: ['./po-details.component.sass']
})
export class PoDetailsComponent implements OnInit {

  ViewedPO: POs = new POs();
  SeletedFile: any;
  UserIsAdmin = this.CheckIfAdmin();

  constructor(@Inject(MAT_DIALOG_DATA) public data: [POs, string[]],
    private dialogref: MatDialogRef<PoDetailsComponent>,
    private dialog: MatDialog,
    private PoService: POsService,
    private Notification: NotificationserService,
    private router: Router,
    private spinner: Spinner
  ) { }

  Functionalities: string[] = this.data[1];

  ngOnInit(): void {
    this.ViewedPO = this.data[0];
    this.AlertMackOnUploadedPO();
    this.CheckFunctionalities();

  }

  AdjustingDataForDisplay(approvalStatus: boolean) {
    return AdjustingDataForDisplay(approvalStatus);
  }
  RemoveDownloadButtonsForNullFilesAndCreateDisclaimers(HtmlElementName: string) {
    document.getElementsByName(HtmlElementName)[0].remove();
    let Disclaimer: Node = document.createElement('a');
    Disclaimer.appendChild(document.createTextNode(HtmlElementName + ": Unavailble"))
    document.getElementById('buttons-2')?.appendChild(Disclaimer)
  }
  CheckFunctionalities() {

    (Array.from(document.getElementsByClassName('buttons'))).forEach(ParentOfDownloadFileButtons => {
      Array.from(ParentOfDownloadFileButtons.children).forEach(DownloadButton => {
        let ButtonName = DownloadButton.getAttribute('name');
        if (!this.Functionalities.includes(ButtonName ?? "")) document.getElementsByName(ButtonName ?? "")[0].remove();
      })
    });

    if (this.ViewedPO.mackPOAttach == "" && document.getElementsByName('MackPo').length >= 1)
      this.RemoveDownloadButtonsForNullFilesAndCreateDisclaimers('MackPo')
    if (this.ViewedPO.shippingDocs == "" && document.getElementsByName('ShippingDocs').length >= 1)
      this.RemoveDownloadButtonsForNullFilesAndCreateDisclaimers('ShippingDocs')
    if (this.ViewedPO.corinthianPOAttach == "" && document.getElementsByName('CorinthainPo').length >= 1)
      this.RemoveDownloadButtonsForNullFilesAndCreateDisclaimers('CorinthainPo')
  }


  DownloadMackPo() {
    DownLoadFile(Directories.MackPo, this.ViewedPO.mackPOAttach)
  }
  DownloadShippingDocument() {
    DownLoadFile(Directories.ShippingDocument, this.ViewedPO.shippingDocs)
  }
  DownloadcorithainPo() {
    DownLoadFile(Directories.CorinthainPo, this.ViewedPO.corinthianPOAttach)
  }


  RejectPo() {
    if(this.ViewedPO.status == ""){
      this.ViewedPO.approvalStatus = false;
      this.ViewedPO.status = "Rejected";
      window.alert("you need to hit Apply changes to Complete the process");
    }else{
      this.Notification.OnError("You Can Not Reject A Po After being Accepted By Alfemo")
    }
  }
  ApprovePo() {
      this.ViewedPO.approvalStatus = true;
      this.ViewedPO.status = "";
      window.alert("you need to hit Apply changes to Complete the process");
  }


  Submit() {
    if (this.SeletedFile) {
      let UploadProcess: any;
      (async () => {
        UploadProcess = await UploadFile(this.PoService, this.ConstructFormDataFile(), this.ConstructFileName(), this.Notification, this.spinner, this.router)
        if (UploadProcess == true) {
          this.MackUpdate();
        }
      })();
    } else {
      this.MackUpdate();
    }
  }
  ConstructFileName() {
    let FileName = RemoveSlashes(this.ViewedPO.dealerPONumber)  + "_" + RemoveSlashes(this.ViewedPO.corinthianPO);
    FileName = AddPreffixAndExtention("MP_", FileName, this.SeletedFile.name)

    return FileName
  }
  ConstructFormDataFile() {
    let fd = new FormData();
    this.ViewedPO.mackPOAttach = this.ConstructFileName();
    fd.append('PO', this.SeletedFile, this.ConstructFileName());
    return fd;
  }
  MackUpdate() {
    this.spinner.WrapWithSpinner(this.PoService.UpdatePo(this.ViewedPO).toPromise().then((res: any) => {
      if (res == true) {
        this.Notification.OnSuccess("You Updated the Po successfully")
        this.Close()
      } else {
        this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
      }
    }, (err: any) => {
      Auth_error_handling(err, this.Notification, this.router)
    }), this.dialogref)
  }
  CorinthainUpdate() {
    this.spinner.WrapWithSpinner(this.PoService.UpdatePo(this.ViewedPO).toPromise().then((res: any) => {
      if (res == true) {
        this.Notification.OnSuccess("You Updated the Po successfully")
        this.Close()
      } else {
        this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
      }
    }, (err: any) => {

      Auth_error_handling(err, this.Notification, this.router)
    }), this.dialogref)
  }
  Close() {
    this.dialogref.close();
  }
  Update() {

    if (this.data[1] == Functionalities.Alfemo) {
      this.dialog.open(AlfemoUpdateComponent, {
        height: '60rem',
        width: '45rem',
        data: this.ViewedPO,
      });
      this.Close();
    } else {
      this.CorinthainUpdate();
    }
  }
  UploadPo(event: any) {
    this.SeletedFile = event.target.files[0];
  }
  
  SetNewDate(event: any) {
    this.ViewedPO.shipBy = event.target.value;
  }
  CheckMackFile() {
    if (this.ViewedPO.mackPOAttach == "") {
      return false
    } else {
      return true
    }
  }
  CheckShippingFile() {
    if (this.ViewedPO.shippingDocs == "") {
      return false
    } else {
      return true
    }
  }
  CheckCorinthainFile() {
    if (this.ViewedPO.corinthianPOAttach == "") {
      return false
    } else {
      return true
    }
  }
  AlertMackOnUploadedPO() {
    if (this.data[1] == Functionalities.Admin) {
      if (this.ViewedPO.mackPOAttach != "") {
        this.Notification.DisplayInfo("You Already Uploaded A File")
      }
    }
  }
  DeletePo() {
    if (confirm("Are You Sure You Want To Delete This Po")) {
      this.ViewedPO.deleted = true;
      this.spinner.WrapWithSpinner(this.PoService.UpdatePo(this.ViewedPO).toPromise().then((res: any) => {
        if (res == true) {
          this.Notification.OnSuccess("You have Deleted the Po successfully")
          location.reload();
          this.Close();
        } else {
          this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
        }
      }, (err: any) => {
        Auth_error_handling(err, this.Notification, this.router)
      }), this.dialogref)
    }
  }
  CheckIfAdmin(){
    return localStorage.getItem('Role') === "admin"
  }
}

// Reject
// Notify Corinthian
// Update Po Or Cancel it
// Notify Mack


