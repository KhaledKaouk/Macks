import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { AddPreffixAndExtention, AdjustingDataForDisplay, Directories, DownLoadFile, Functionalities, ProgrssBar, UploadFile } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { AlfemoUpdateComponent } from '../alfemo-update/alfemo-update.component';

@Component({
  selector: 'app-po-details',
  templateUrl: './po-details.component.html',
  styleUrls: ['./po-details.component.sass']
})
export class PoDetailsComponent implements OnInit {

  ViewedPO: POs = new POs();
  progressRef: any;
  SeletedFile: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: [POs, string[]],
    private dialogref: MatDialogRef<PoDetailsComponent>,
    private dialog: MatDialog,
    private PoService: POsService,
    private Notification: NotificationserService,
    private progress: NgProgress,
    private router: Router,
  ) { }

  Functionalities: string[] = this.data[1];

  ngOnInit(): void {
    this.ViewedPO = this.data[0];

    this.AlertMackOnUploadedPO();
    this.CheckFunctionalities();
    this.progressRef = this.progress.ref('PoPopUProgress');

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
    /* (Array.from(document.getElementsByClassName('buttons')[0].children)).forEach(element => {
      let ElementName = element.getAttribute('name');
      if (!this.Functionalities.includes(ElementName ??
         "")) {
        document.getElementsByName(ElementName ?? "")[0].remove();
      }
    });
    (Array.from(document.getElementsByClassName('buttons')[1].children)).forEach(element => {
      let ElementName = element.getAttribute('name');
      if (!this.Functionalities.includes(ElementName ?? "")) {
        document.getElementsByName(ElementName ?? "")[0].remove();
      }
    }) */
    

    /* if (this.ViewedPO.mackPOAttach == "" && document.getElementsByName('MackPo').length >= 1) {
      document.getElementsByName('MackPo')[0].remove();
      let Disclaimer: Node = document.createElement('a');
      Disclaimer.appendChild(document.createTextNode("MackPo: Unavailble"))
      document.getElementById('buttons-2')?.appendChild(Disclaimer)
    }
    if (this.ViewedPO.shippingDocs == "") {
      document.getElementsByName('ShippingDocs')[0].remove();
      let Disclaimer: Node = document.createElement('a');
      Disclaimer.appendChild(document.createTextNode("ShippingDocs: Unavailble"))
      document.getElementById('buttons-2')?.appendChild(Disclaimer)
    }
    if (this.ViewedPO.corinthianPOAttach == "" && document.getElementsByName('CorinthainPo').length >= 1) {
      document.getElementsByName('CorinthainPo')[0].remove();
      let Disclaimer: Node = document.createElement('a');
      Disclaimer.appendChild(document.createTextNode("CorinthainPo: Unavailble"))
      document.getElementById('buttons-2')?.appendChild(Disclaimer)
    } */

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
    this.ViewedPO.approvalStatus = false;
    window.alert("you need to hit Apply changes to Complete the process");
  }
  ApprovePo() {
    this.ViewedPO.approvalStatus = true;
    window.alert("you need to hit Apply changes to Complete the process");
  }
  Submit() {
    this.progressRef.start();

    let fd = new FormData();

    if (this.SeletedFile) {
      let FileName = this.ViewedPO.dealerPONumber + "_" + this.ViewedPO.corinthianPO;
      FileName = AddPreffixAndExtention("MP_", FileName, this.SeletedFile.name)

      this.ViewedPO.mackPOAttach = FileName

      fd.append('PO', this.SeletedFile, FileName);

      let UploadProcess: any;
      (async () => {
        UploadProcess = await UploadFile(this.PoService, fd, FileName, this.Notification, this.progressRef, this.router)
        if (UploadProcess == true) {
          this.MackUpdate();
        }
      })();
    } else {
      this.MackUpdate();
    }
  }
  MackUpdate() {
    this.PoService.UpdatePo(this.ViewedPO).toPromise().then((res: any) => {
      if (res == true) {
        this.Notification.OnSuccess("You Updated the Po successfully")
        this.Close()
      } else {
        this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
      }
    }, (err: any) => {
      Auth_error_handling(err, this.progressRef, this.Notification, this.router)
    }).finally(() => { this.progressRef.complete(); })
  }
  CorinthainUpdate() {
    ProgrssBar(this.PoService.UpdatePo(this.ViewedPO).toPromise().then((res: any) => {
      if (res == true) {
        this.Notification.OnSuccess("You Updated the Po successfully")
        this.Close()
      } else {
        this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
      }
    }, (err: any) => {
      Auth_error_handling(err, this.progressRef, this.Notification, this.router)
    }), this.progressRef)
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
    } else {
      this.CorinthainUpdate();
    }
  }
  UploadPo(event: any) {
    this.SeletedFile = event.target.files[0];
  }
  SetNewDate(event: any) {
    this.ViewedPO.productionRequestDate = event.target.value;
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
}

