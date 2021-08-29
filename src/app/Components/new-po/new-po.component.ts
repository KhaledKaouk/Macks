import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { promise } from 'protractor';
import { Dealers } from 'src/app/Models/Dealers';
import { POs } from 'src/app/Models/Po-model';
import { DealersService } from 'src/app/Services/dealers.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { AddPreffixAndExtention, CreateDatabase, RemoveSlashes, Spinner, UploadFile } from 'src/app/Utilities/Common';
import { CheckDealersToMatchOfflineDB, PromiseAllDealers } from 'src/app/Utilities/DealersCRUD';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling'
import { NewDealerComponent } from '../new-dealer/new-dealer.component';
@Component({
  selector: 'app-new-po',
  templateUrl: './new-po.component.html',
  styleUrls: ['./new-po.component.sass']
})
export class NewPoComponent implements OnInit {


  Loading: boolean = false;
  Dealers: Dealers[] = [];
  NewPo: POs = new POs();

  CreatePo = new FormGroup({
    DealerId: new FormControl('', Validators.required),
    DealerPo: new FormControl('', Validators.required),
    CorinthainPo: new FormControl('', Validators.required),
    ShipBy: new FormControl('', Validators.required),
    Comments: new FormControl('')
  })

  SeletedFile: any;

  constructor(private Pos: POsService,
    private Notification: NotificationserService,
    private router: Router,
    private dialog: MatDialog,
    private DealerServies: DealersService,
    private spinner: Spinner) { }

  ngOnInit(): void {
    CheckToken(this.router);
    this.GetAllDealers();
  }

  GetAllDealers() {
    this.DealerServies.GetAllDealers().then((res: any) => {
      this.Dealers = res
      this.Dealers.sort((a, b) => {
        if (a.name[0].toLowerCase() > b.name[0].toLowerCase()) return +1
        if (a.name[0].toLowerCase() < b.name[0].toLowerCase()) return -1
        return 0
      });
    })
  }

  Submit() {
    this.DisableSubmitButton();
    this.AssignFormValuesToNewPoObject();

    if (this.SeletedFile) {
      let UploadProcess: any;
      (async () => {
        UploadProcess = await UploadFile(this.Pos, this.ConstructFormDataFile(), this.ConstructFileName(), this.Notification, this.spinner, this.router)
        if (UploadProcess == true) {
          this.CreatePO();
        }
        this.EnableSubmitButton();
      })();
    }
    else {
      this.EnableSubmitButton();
      this.Notification.OnError('Please Select A Po To Upload')
    }
  }

  ConstructFileName() {
    let FileName = RemoveSlashes(this.NewPo.dealerPONumber) + "_" + RemoveSlashes(this.NewPo.corinthianPO);
    FileName = AddPreffixAndExtention("SD_", FileName, this.SeletedFile.name)

    return FileName
  }
  ConstructFormDataFile() {
    let fd = new FormData();
    this.NewPo.shippingDocs = this.ConstructFileName();
    fd.append('PO', this.SeletedFile, this.ConstructFileName());
    return fd;
  }

  CreatePO() {
    this.spinner.WrapWithSpinner(this.Pos.CreatePo(this.NewPo).toPromise().then((res: any) => {
      this.Notification.OnSuccess(res)
      this.router.navigateByUrl('/MyPos')

    }, (err: any) => {
      Auth_error_handling(err, this.Notification, this.router)
      this.EnableSubmitButton();
    }))
  }

  SaveFileInObject(event: any) {
    this.SeletedFile = event.target.files[0];
  }
  ExtractDealerName(Id: string) {
    return this.Dealers.find(Dealer => Dealer.id == Id)?.name || "Unavailable"
  }
  ExtractDealerEmail(Id: string) {
    return this.Dealers.find(Dealer => Dealer.id == Id)?.email || "Unavailable "
  }


  DisableSubmitButton() { this.Loading = true }
  EnableSubmitButton() { this.Loading = false }


  AssignFormValuesToNewPoObject() {
    let DealerId = this.CreatePo.get("DealerId")?.value;

    this.NewPo.dealer_id = DealerId;
    this.NewPo.dealerName = this.ExtractDealerName(DealerId);
    this.NewPo.dealerEmail = this.ExtractDealerEmail(DealerId);
    this.NewPo.dealerPONumber = this.CreatePo.get("DealerPo")?.value;
    this.NewPo.corinthianPO = this.CreatePo.get("CorinthainPo")?.value;
    this.NewPo.shipBy = this.CreatePo.get("ShipBy")?.value;
    this.NewPo.comments = this.CreatePo.get("Comments")?.value;
    this.NewPo.corinthianPOAttach = this.NewPo.dealerName + this.NewPo.corinthianPO;
    this.NewPo.dateReceived = new Date().toLocaleDateString()

  }


  OperNewDealerForm() {
    this.dialog.open(NewDealerComponent, {
      height: '30rem',
      width: '55rem',
    })
  }

}

