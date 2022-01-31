import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Dealers } from 'src/app/Models/Dealers';
import { POs } from 'src/app/Models/Po-model';
import { port } from 'src/app/Models/port';
import { DealersService } from 'src/app/Services/dealers.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { PortService } from 'src/app/Services/port.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { AddPreffixAndExtention, DIs, RemoveSlashes, Spinner } from 'src/app/Utilities/Common';
import { CompareDealerNames } from 'src/app/Utilities/DealersHandlers';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling'
import * as FileHandlers from 'src/app/Utilities/FileHandlers';
import { CreateMackPo } from 'src/app/Utilities/PoHandlers';
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
  Ports: port[] = [];

  CreatePo = new FormGroup({
    DealerId: new FormControl('', Validators.required),
    DealerPo: new FormControl('', Validators.required),
    CorinthainPo: new FormControl('', Validators.required),
    ShipBy: new FormControl('', Validators.required),
    InvoiceDate: new FormControl('', Validators.required),
    Comments: new FormControl(''),
    port: new FormControl('', Validators.required)
  })

  SeletedFile: any;

  constructor(private Pos: POsService,
    private portservice: PortService,
    private Notification: NotificationserService,
    private router: Router,
    private dialog: MatDialog,
    private DealerServies: DealersService,
    private spinner: Spinner,
    private DIs: DIs
  ) { }

  ngOnInit(): void {
    CheckToken(this.router);
    this.GetAllDealers();
    this.GetPorts();
  }

  GetAllDealers() {
    this.DealerServies.GetAllDealers().then((dealers: any) => {
      this.Dealers = dealers
      this.Dealers.sort((a, b) => CompareDealerNames(a.name, b.name))
    }, err => Auth_error_handling(err, this.Notification, this.router))
  }

  async Submit() {
    this.DisableSubmitButton();
    this.AssignFormValuesToNewPoObject();
    if (this.SeletedFile) {
      let UploadProcess: any;
      let FileName = FileHandlers.ConstructFileName(this.NewPo, "MP_", this.SeletedFile.name)
      let MackPo: File;
      let fd = new FormData();

      MackPo = await CreateMackPo(this.SeletedFile, FileName)
      this.AssignMackPoFileToPo(FileName)
      await FileHandlers.UploadFile(FileHandlers.ConstructFormDataFile(MackPo, MackPo.name), MackPo.name, this.DIs)

      UploadProcess = await FileHandlers.UploadFile(
        this.ConstructFormDataFile(),
        this.ConstructFileName(),
        this.DIs)

      if (UploadProcess == true) this.CreatePO();
      this.EnableSubmitButton();
    }
    else {
      this.EnableSubmitButton();
      this.Notification.OnError('Please Select A Po To Upload')
    }
  }
  AssignMackPoFileToPo(FileName: string) {
    this.NewPo.mackPOAttach = FileName;
  }
  ConstructFileName() {
    let FileName = RemoveSlashes(this.NewPo.dealerPoNumber) + "_" + RemoveSlashes(this.NewPo.corinthianPoNumber);
    FileName = AddPreffixAndExtention("NP_", FileName, this.SeletedFile.name)

    return FileName
  }
  ConstructFormDataFile() {
    let fd = new FormData();
    this.NewPo.corinthianPOAttach = this.ConstructFileName();
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
    console.log(this.SeletedFile)
  }
  ExtractDealerName(Id: string) {
    return this.Dealers.find(Dealer => Dealer._id == Id)?.name || "Unavailable"
  }
  ExtractDealerEmail(Id: string) {
    return this.Dealers.find(Dealer => Dealer._id == Id)?.email || "Unavailable "
  }


  DisableSubmitButton() { this.Loading = true }
  EnableSubmitButton() { this.Loading = false }


  AssignFormValuesToNewPoObject() {
    let DealerId = this.CreatePo.get("DealerId")?.value;

    this.NewPo.dealer_id = DealerId;
    this.NewPo.dealerPoNumber = this.CreatePo.get("DealerPo")?.value;
    this.NewPo.corinthianPoNumber = this.CreatePo.get("CorinthainPo")?.value;
    this.NewPo.shipBy = this.CreatePo.get("ShipBy")?.value;
    this.NewPo.corinthianComments = this.CreatePo.get("Comments")?.value;
    this.NewPo.corinthianPOAttach = this.NewPo.dealerPoNumber + this.NewPo.corinthianPoNumber;
    this.NewPo.dateReceived = new Date().toLocaleDateString()
    this.NewPo.invoiceDate = this.CreatePo.get('InvoiceDate')?.value;
    this.NewPo.port = this.CreatePo.get('port')?.value;

  }

  GetPorts() {
    this.portservice.GetPorts().then((res: any) => {
      this.Ports = res
    })
  }
  OperNewDealerForm() {
    this.dialog.open(NewDealerComponent, {
      height: '30rem',
      width: '55rem',
    })
  }
  SetPortForPo(event: any){
    let SelectedDealer = this.Dealers.find(dealer => dealer._id == event.target.value) || new Dealers()
    let DealerPortName = this.Ports.find(port => port._id == SelectedDealer.PortId) || new port();
    this.CreatePo.get('port')?.setValue(DealerPortName.portName);
  }
}

