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
import { AddPreffixAndExtention, CreateDatabase, RemoveSlashes, Spinner } from 'src/app/Utilities/Common';
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
    // DealerPo: new FormControl('', Validators.required),
    // CorinthainPo: new FormControl('', Validators.required),
    shipBy: new FormControl('', Validators.required),
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
    
    this.PoToUpdate.dealerName = this.ExtractDealerName(DealerId);
    this.PoToUpdate.dealerEmail = this.ExtractDealerEmail(DealerId);
    // this.PoToUpdate.dealerPONumber = this.CreatePo.get("DealerPo")?.value;
    // this.PoToUpdate.corinthianPO = this.CreatePo.get("CorinthainPo")?.value;
    this.PoToUpdate.shipBy = this.CreatePo.get("shipBy")?.value;
    this.PoToUpdate.comments = this.CreatePo.get("Comments")?.value;
    // let NewFileName = AddPreffixAndExtention("NP_", RemoveSlashes(this.PoToUpdate.dealerPONumber) + "_" + RemoveSlashes(this.PoToUpdate.corinthianPO),this.PoToUpdate.corinthianPOAttach);
    // this.PoToUpdate.corinthianPOAttach = NewFileName;


  }


  ExtractDealerName(Id:string){
    return this.Dealers.find(Dealer => Dealer.id == Id)?.name || "Unavailable"
  }
  ExtractDealerEmail(Id: string){
    return this.Dealers.find(Dealer => Dealer.id == Id)?.email || "Unavailable"
  }
  ExtractDealerId(DealerName: string){
    return this.Dealers.find(Dealer => Dealer.name === DealerName)?.id
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
      DealerId: this.ExtractDealerId(this.PoToUpdate.dealerName),
      // DealerPo: this .PoToUpdate.dealerPONumber,
      // CorinthainPo: this.PoToUpdate.corinthianPO,
      shipBy: this.PoToUpdate.shipBy,
      Comments: this.PoToUpdate.comments
    })
  }
  Close(){
    this.dialogref.close();
  }
}
