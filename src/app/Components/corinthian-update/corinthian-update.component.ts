import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Dealers } from 'src/app/Models/Dealers';
import { POs } from 'src/app/Models/Po-model';
import { DealersService } from 'src/app/Services/dealers.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { AddPreffixAndExtention, CreateDatabase, FormatDate, RemoveSlashes, Spinner } from 'src/app/Utilities/Common';
import { CheckDealersToMatchOfflineDB, PromiseAllDealers } from 'src/app/Utilities/DealersCRUD';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { NewDealerComponent } from '../new-dealer/new-dealer.component';

@Component({
  selector: 'app-corinthian-update',
  templateUrl: './corinthian-update.component.html',
  styleUrls: ['./corinthian-update.component.sass']
})
export class CorinthianUpdateComponent implements OnInit {

  Loading: boolean = false;
  Dealers: Dealers[] = [];
  PoToUpdate: POs = new POs();

  CreatePo = new FormGroup({
    DealerId: new FormControl('', Validators.required),
    shipBy: new FormControl('', Validators.required),
    InvoiceDate: new FormControl('',Validators.required),
    Comments: new FormControl('')
  })

  constructor(private Pos: POsService,
    private DealerServies: DealersService,
    private Notification: NotificationserService,
    private router: Router,
    private dialog: MatDialog,
    private dialogref: MatDialogRef<CorinthianUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: POs,
    private spinner: Spinner) { }

  ngOnInit(): void {
    CheckToken(this.router);
    this.PoToUpdate = this.data;
    this.GetAllDealers();
 
  }

  GetAllDealers(){
    this.DealerServies.GetAllDealers().then((res: any) =>{
      this.Dealers = res;
      this.AssignPoToForm();
    })
  }
  Submit(){
    this.DisableSubmitButton();
    this.AssignFormValuesToUpdatedPo();
    this.UpdatePO();
    this.EnableSubmitButton();

  }
  DisableSubmitButton() { this.Loading = true }
  EnableSubmitButton() { this.Loading = false }

  AssignFormValuesToUpdatedPo() {
    let DealerId =  this.CreatePo.get("DealerId")?.value;
    
    this.PoToUpdate.dealer_id = DealerId;
    this.PoToUpdate.shipBy = this.CreatePo.get("shipBy")?.value;
    this.PoToUpdate.invoiceDate = this.CreatePo.get('InvoiceDate')?.value;
    this.PoToUpdate.corinthianComments = this.CreatePo.get("Comments")?.value;
  }

  UpdatePO() {
    this.spinner.WrapWithSpinner(this.Pos.UpdatePo(this.PoToUpdate).toPromise().then((res: any) => {
      this.Notification.OnSuccess(res)
      this.Close();
    }, (err: any) => {
      Auth_error_handling(err, this.Notification, this.router)
      this.EnableSubmitButton();
    }),this.dialogref)
  }
  OperNewDealerForm() {
    this.dialog.open(NewDealerComponent, {
      height: '30rem',
      width: '55rem',
    })
  }
  AssignPoToForm(){
    this.CreatePo.setValue({
      DealerId: this.PoToUpdate.dealer_id,
      shipBy: FormatDate(this.PoToUpdate.shipBy) ,
      Comments: this.PoToUpdate.corinthianComments,
      InvoiceDate: this.PoToUpdate.invoiceDate,
    })
  }
  Close(){
    this.dialogref.close();
  }
}
