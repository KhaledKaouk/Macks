import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Dealers } from 'src/app/Models/Dealers';
import { POs } from 'src/app/Models/Po-model';
import { Shipment } from 'src/app/Models/Shipment';
import { DealersService } from 'src/app/Services/dealers.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { ShipmentService } from 'src/app/Services/shipment.service';
import { CheckCorinthianUserPermissions } from 'src/app/Utilities/CheckAuth';
import { AddPreffixAndExtention, DIs, RemoveSlashes, Spinner } from 'src/app/Utilities/Common';
import { GetDealerById } from 'src/app/Utilities/DealersHandlers';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { ConvertExcelFileIntoHtml, GetWorkSheet } from 'src/app/Utilities/ExcelHandlers';
import { DownLoadFile, UploadFile } from 'src/app/Utilities/FileHandlers';
import { AdjustApprovalStatusForDisplay } from 'src/app/Utilities/PoHandlers';
import { APIURL, Directories, Functionalities, Status, Tools } from 'src/app/Utilities/Variables';
import { GetFileExtenstion, Unzip } from 'src/app/Utilities/ZipHandlers';
import { AlfemoUpdateComponent } from '../alfemo-update/alfemo-update.component';
import { ExcelFileViewComponent } from '../excel-file-view/excel-file-view.component';

@Component({
  selector: 'app-po-details',
  templateUrl: './po-details.component.html',
  styleUrls: ['./po-details.component.sass']
})
export class PoDetailsComponent implements OnInit {

  ViewedPO: POs = new POs();
  AllDealers: Dealers[] = [];
  Dealer: Dealers = new Dealers();
  SeletedFile: any;
  UserIsAdmin = this.CheckIfAdmin();
  ShippindDocsFileNames: string[] = [];
  ShippingDocsFiles: File[] = [];
  AllShipments: Shipment[] = [];
  PoShipment: Shipment = new Shipment();
  ProductDetails: boolean = false;
  H: string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: [POs, string[]],
    private dialogref: MatDialogRef<PoDetailsComponent>,
    private dialog: MatDialog,
    private PoService: POsService,
    private ShipmentService: ShipmentService,
    private DealerService: DealersService,
    private Notification: NotificationserService,
    private router: Router,
    private spinner: Spinner,
    private DIs: DIs
  ) { }

  Functionalities: string[] = this.data[1];

  ngOnInit(): void {
    this.ViewedPO = this.data[0];
    this.GetShipment();
    this.AlertMackOnUploadedPO();
    this.CheckFunctionalities();
    this.GetAllDealers();
  }
  async GetShipment() {
    if (this.CheckForShipmentValidation()) {
      await this.ShipmentService.GetAllShipments()
        .then(
          (shipments: any) => {
            this.AllShipments = shipments;
            this.PoShipment = this.FindPoShipment()
            this.AssignShipmentInfoToPo();
          },
          err => Auth_error_handling(err, this.Notification, this.router)
        )
    }
  }
  CheckForShipmentValidation() {
    return this.ViewedPO.ShipmentId != '' && this.ViewedPO.ShipmentId
  }
  FindPoShipment() {
    return this.AllShipments.find(shipment => shipment._id == this.ViewedPO.ShipmentId) || new Shipment()
  }
  AssignShipmentInfoToPo() {
    this.ViewedPO.factoryEstimatedArrivalDate = this.PoShipment.ETA;
    this.ViewedPO.factoryEstimatedShipDate = this.PoShipment.ETD;
    this.ViewedPO.status = this.PoShipment.Status;
  }
  AdjustingDataForDisplay(approvalStatus: boolean) {
    return AdjustApprovalStatusForDisplay(approvalStatus);
  }
  GetAllDealers() {
    this.spinner.WrapWithSpinner(this.DealerService.GetAllDealers().then((Dealers: any) => {
      this.AllDealers = Dealers;
      this.DisplayDealerInfo();
    }), this.dialogref)
  }
  DisplayDealerInfo() {
    this.Dealer = GetDealerById(this.AllDealers, this.ViewedPO.dealer_id)
  }
  RemoveDownloadButtonsForNullFilesAndCreateDisclaimers(HtmlElementName: string) {
    document.getElementsByName(HtmlElementName)[0].remove();
    let Disclaimer: Node = document.createElement('a');
    Disclaimer.appendChild(document.createTextNode(HtmlElementName + ": Unavailble"))
    document.getElementById('buttons-2')?.appendChild(Disclaimer)
  }
  CheckFunctionalities() {
    this.RemoveNotAllowedButtons();
    if (this.CheckPoFileAndDownLoadButton(this.ViewedPO.mackPOAttach, "MackPo"))
      this.RemoveDownloadButtonsForNullFilesAndCreateDisclaimers('MackPo')
    if (this.CheckPoFileAndDownLoadButton(this.ViewedPO.shippingDocs, "ShippingDocs"))
      this.RemoveDownloadButtonsForNullFilesAndCreateDisclaimers('ShippingDocs')
    if (this.CheckPoFileAndDownLoadButton(this.ViewedPO.corinthianPOAttach, "CorinthainPo"))
      this.RemoveDownloadButtonsForNullFilesAndCreateDisclaimers('CorinthainPo')
  }

  CheckPoFileAndDownLoadButton(PoFileField: string, ButtonName: string) {
    return PoFileField == "" && document.getElementsByName(ButtonName).length >= 1
  }
  RemoveNotAllowedButtons() {
    (Array.from(document.getElementsByClassName('buttons'))).forEach(ParentOfDownloadFileButtons => {
      Array.from(ParentOfDownloadFileButtons.children).forEach(DownloadButton => {
        let ButtonName = DownloadButton.getAttribute('name');
        if (!this.Functionalities.includes(ButtonName ?? "")) document.getElementsByName(ButtonName ?? "")[0].remove();
      })
    });
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
  async ViewShippingDocs() {
    let ShippingDocsFile: any;

    let ResponseWithShippingDocsBlob = await fetch(APIURL + 'Assets/SD/' + this.ViewedPO.shippingDocs)
    // let ResponseWithShippingDocsBlob = await fetch(APIURL + 'Assets/SD/SD_1.zip')
    let ShippingDocsBlob = await ResponseWithShippingDocsBlob.clone().blob();

    ShippingDocsFile = ShippingDocsBlob;
    ShippingDocsFile.name = "1.zip"
    ShippingDocsFile.lastModifiedDate = new Date();

    this.ShippingDocsFiles = await Unzip(ShippingDocsFile);

    this.ShippingDocsFiles.forEach(file => {
      this.ShippindDocsFileNames.push(file.name)
    })
    return ShippingDocsFile as File
  }
  async ViewFile(FileName: string) {
    let file = this.ShippingDocsFiles.find(file => file.name.toLowerCase().includes(FileName.toLowerCase())) || new File([], 'empty')
    if (GetFileExtenstion(file) == 'xlsx' || 'xls'){
      this.H = ConvertExcelFileIntoHtml(await GetWorkSheet(file))
      this.dialog.open(ExcelFileViewComponent, {
        height: '30rem',
        width: '55rem',
        data: this.H,
      });
    }else{
      window.open(URL.createObjectURL(file))
    }
  }
  RejectPo() {
    if (this.ViewedPO.status == "") {
      this.ViewedPO.approvalStatus = false;
      this.ViewedPO.status = "Rejected";
      window.alert("you need to hit Apply changes to Complete the process");
    } else {
      this.Notification.OnError("You Can Not Reject A Po After being Accepted By Alfemo")
    }
  }
  ApprovePo() {
    this.ViewedPO.approvalStatus = true;
    this.ViewedPO.status = "";
    window.alert("you need to hit Apply changes to Complete the process");
  }
  CancelPo() {
    let StatusOption: Status;
    StatusOption = 'Cancel Request';
    this.ViewedPO.status = StatusOption;
    this.MackUpdate();
  }
  HoldPo() {
    let StatusOption: Status;
    StatusOption = 'Hold Request';
    this.ViewedPO.status = StatusOption;
    this.MackUpdate()
  }


  async Submit() {
    if (this.SeletedFile) {
      let UploadProcess: any;
      UploadProcess = await UploadFile(
        this.ConstructFormDataFile(),
        this.ConstructFileName(),
        this.DIs,
        this.dialogref)

      if (UploadProcess == true) {
        this.MackUpdate();
      }
    } else {
      this.MackUpdate();
    }
  }
  ConstructFileName() {
    let FileName = RemoveSlashes(this.ViewedPO.dealerPoNumber) + "_" + RemoveSlashes(this.ViewedPO.corinthianPoNumber);
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
      this.DisplayNotification();
      this.Close()
    }, (err: any) => {
      Auth_error_handling(err, this.Notification, this.router)
    }), this.dialogref)
  }

  DisplayNotification() {
    this.Notification.OnSuccess("You Updated the Po successfully")
  }
  Close() {
    this.dialogref.close();
  }
  Update() {
    this.dialog.open(AlfemoUpdateComponent, {
      height: '60rem',
      width: '45rem',
      data: this.ViewedPO,
    });
    this.Close();
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
    this.ViewedPO.deleted = true;
    this.spinner.WrapWithSpinner(this.PoService.UpdatePo(this.ViewedPO).toPromise().then((res: any) => {
      this.Notification.OnSuccess("You have Deleted the Po successfully")
      location.reload();
      this.Close();
    }, (err: any) => {
      Auth_error_handling(err, this.Notification, this.router)
    }), this.dialogref)
  }
  ConfirmDeleteRequest() {
    if (confirm("Are You Sure You Want To Delete This Po")) this.DeletePo()
  }
  CheckIfAdmin() {
    return localStorage.getItem('Role') === "admin"
  }
  CheckIfHolley() {
    return CheckCorinthianUserPermissions();
  }
}
