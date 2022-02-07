import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dealers } from 'src/app/Models/Dealers';
import { Invoice } from 'src/app/Models/Invoice';
import { POs } from 'src/app/Models/Po-model';
import { Shipment } from 'src/app/Models/Shipment';
import { DealersService } from 'src/app/Services/dealers.service';
import { InvoiceService } from 'src/app/Services/invoice.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { ShipmentService } from 'src/app/Services/shipment.service';
import { CheckCorinthianUserPermissions } from 'src/app/Utilities/CheckAuth';
import { CalculatePageCount, DIs, InitPageCountArray, RemoveSearchDisclaimer, ShowSearchDisclaimer, Spinner } from 'src/app/Utilities/Common';
import { GetDealerById } from 'src/app/Utilities/DealersHandlers';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { ConstructFormDataFile, UploadFile } from 'src/app/Utilities/FileHandlers';
import { AdjustApprovalStatusForDisplay } from 'src/app/Utilities/PoHandlers';
import { FilterByPOsNumberOrInvoiceNumber } from 'src/app/Utilities/ShipmentHandlers';
import { APIURL, ShipmentStatus } from 'src/app/Utilities/Variables';
import * as ZipHandler from 'src/app/Utilities/ZipHandlers'

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.sass']
})
export class InvoicesComponent implements OnInit {

  AllInvoices: Invoice[] = [];
  AllPos: POs[] = [];
  AllDealers: Dealers[] = [];
  AllShipments: Shipment[] = [];
  ShipmentPOs: POs[] = [];
  PageCountArray: number[] = [0];
  PagesCount: number = 1;
  DataRowsInPage: number = 8;
  DataOfCurrentPage: Shipment[] = [];
  CurrentPage: number = 0;
  ShipmentsForSlicing: Shipment[] = [];
  ShippingDocs: File[] = [];
  ViewedPO: POs = new POs();
  Dealer: Dealers = new Dealers();
  UserIsAdmin: boolean = this.CheckIfAdmin();
  SelectedShipment: Shipment = new Shipment();
  PoIndex: string = '';
  ShipmentOnDisplay: boolean = true;
  SelectedFile: any;
  FileName: string = "";
  ShipmentStatus: string[] = ShipmentStatus;

  constructor(
    private InvoiceService: InvoiceService,
    private DealerService: DealersService,
    private PoService: POsService,
    private ShipmentService: ShipmentService,
    private NotificationService: NotificationserService,
    private router: Router,
    private spinner: Spinner,
    private DIS: DIs,
  ) { }

  ngOnInit(): void {
    this.GetRequiredDataForDisplay();
  }

  async GetRequiredDataForDisplay() {
    this.GetPOs();
    this.GetInvoices();
    this.GetDealers();
    await this.GetShipments();
  }

  async GetShipments() {
    await this.ShipmentService.GetAllShipments()
      .then(
        (shipments: any) => {
          this.AllShipments = shipments;
          this.PagesCount = CalculatePageCount(this.AllShipments.length, this.DataRowsInPage);
          this.PageCountArray = InitPageCountArray(this.PagesCount)
          this.SliceDataForPaginantion(0);
        },
        err => Auth_error_handling(err, this.NotificationService, this.router)
      )
  }
  GetPOs() {
    this.PoService.GetPos()
      .then(
        (POs: any) => this.AllPos = POs,
        err => Auth_error_handling(err, this.NotificationService, this.router)
      )
  }
  GetInvoices() {
    this.spinner.WrapWithSpinner(this.InvoiceService.GetInvoices()
      .then(
        (Invoices: any) => this.AllInvoices = Invoices,
        err => Auth_error_handling(err, this.NotificationService, this.router)
      )
    )
  }
  GetDealers() {
    this.DealerService.GetAllDealers()
      .then(
        (dealers: any) => this.AllDealers = dealers,
        err => Auth_error_handling(err, this.NotificationService, this.router)
      )
  }
  async ShowShppingDocsDetails(SelectedShipment: Shipment) {
    this.ShippingDocs = [];
    this.ShipmentPOs = SelectedShipment.POs
    this.ViewedPO = this.ShipmentPOs[0];
    this.PoIndex = (this.ShipmentPOs.indexOf(this.ViewedPO) + 1).toString();
    this.DisplayDealerInfo();
    this.UnzipShippingDocs(await this.GetShippingDocsZip(SelectedShipment))
    this.SelectedShipment = SelectedShipment;
  }
  DisplayDealerInfo() {
    this.Dealer = GetDealerById(this.AllDealers, this.ViewedPO.dealer_id)
  }
  OpenInvoiceUpdateComponent(SelectedShipment: Shipment) { }
  OpenCreateBOLComponent(SelectedShipment: Shipment) {
    this.router.navigate(['/BOL', SelectedShipment.Invoice.Number])
  }
  SliceDataForPaginantion(PageNumber: number, SearchedShipments?: Shipment[]) {
    this.ShipmentsForSlicing = this.AllShipments;
    if (SearchedShipments) this.ShipmentsForSlicing = SearchedShipments;
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if (this.ShipmentsForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage).length >= 1) {
      RemoveSearchDisclaimer();
      this.DataOfCurrentPage = this.ShipmentsForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage)
      this.CurrentPage = PageNumber;
    } else {
      this.DataOfCurrentPage = []
      ShowSearchDisclaimer(this.DataOfCurrentPage.length);
    }
  }
  NextPage() {
    this.SliceDataForPaginantion(this.CurrentPage + 1)
  }
  PreviousPage() {
    this.SliceDataForPaginantion(this.CurrentPage - 1)
  }
  ViewFile(FileName: string) {
    if (this.SelectedShipment._id != '') window.open(this.GetFileAsUrl(FileName))
  }
  async GetShippingDocsZip(SelectedShipment: Shipment) {
    let ShippingDocsFile: any;

    let ResponseWithShippingDocsBlob = await fetch(APIURL + 'Assets/SD/' + "SD_" + SelectedShipment.Invoice.Number + ".zip")
    let ShippingDocsBlob = await ResponseWithShippingDocsBlob.clone().blob();

    ShippingDocsFile = ShippingDocsBlob;
    ShippingDocsFile.name = SelectedShipment.Invoice.Number + ".zip"
    ShippingDocsFile.lastModifiedDate = new Date();

    return ShippingDocsFile as File
  }
  async UnzipShippingDocs(ShippingDoocs: File) {
    await ZipHandler.Unzip(ShippingDoocs)
      .then(Files => {
        this.ShippingDocs = Files;
      })
  }
  GetFileAsUrl(FileName: string) {
    let WantedFile: File = new File([], "");
    this.ShippingDocs.forEach(File => {
      WantedFile = File.name.toLowerCase().trim().includes(FileName.toLowerCase().trim()) ? File : WantedFile;
    })
    return URL.createObjectURL(WantedFile);
  }
  CheckIfAdmin() {
    return localStorage.getItem('Role')?.toLowerCase() === "admin"
  }
  CheckIfHolley() {
    return CheckCorinthianUserPermissions();
  }
  AdjustingDataForDisplay(approvalStatus: boolean) {
    return AdjustApprovalStatusForDisplay(approvalStatus);
  }
  NextPo() {
    let ViewPoIsLastPo = this.ShipmentPOs.indexOf(this.ViewedPO) == this.ShipmentPOs.length - 1

    if (!ViewPoIsLastPo) {
      this.ViewedPO = this.ShipmentPOs[this.ShipmentPOs.indexOf(this.ViewedPO) + 1]
      this.DisplayDealerInfo();
      this.PoIndex = (this.ShipmentPOs.indexOf(this.ViewedPO) + 1).toString();
    }
  }
  PreviousPo() {
    let ViewPoIsFirstPo = this.ShipmentPOs.indexOf(this.ViewedPO) == 0

    if (!ViewPoIsFirstPo) {
      this.ViewedPO = this.ShipmentPOs[this.ShipmentPOs.indexOf(this.ViewedPO) - 1]
      this.DisplayDealerInfo()
      this.PoIndex = (this.ShipmentPOs.indexOf(this.ViewedPO) + 1).toString();
    }
  }
  CheckFile(FileName: string) {
    let Available = !(this.ShippingDocs.find((file) => file.name.toLowerCase().trim().includes(FileName.toLowerCase().trim())) == undefined)
    return Available
  }
  ViewPOs() {
    this.ShipmentOnDisplay = false;
  }
  ViewShipment() {
    this.ShipmentOnDisplay = true;
  }
  ViewInvoiceForm() {
    if (this.SelectedShipment._id != '') this.router.navigate(['/Invoice'], { queryParams: { IP: this.GetCorinthianPoFileNames(), Port: this.SelectedShipment.POs[0].port, PosIds: this.GetPoIds() } })
  }
  ViewISFForm() {
    if (this.SelectedShipment._id != '') this.router.navigate(['/ISF'], { queryParams: { Pos: this.GetPoIds(), ShipmentId: this.SelectedShipment._id } })
  }
  GetCorinthianPoFileNames() {
    let PoFileNames: string[] = []
    this.SelectedShipment.POs.forEach(po => PoFileNames.push(po.corinthianPOAttach))

    return PoFileNames
  }
  GetPoIds() {
    let PosIds: string[] = [];
    this.SelectedShipment.POs.forEach(po => PosIds.push(po._id))

    return PosIds;
  }
  SearchShipments(event: any) {
    this.SliceDataForPaginantion(0, FilterByPOsNumberOrInvoiceNumber(this.AllShipments, event.target.value))
  }
  UploadBOL() {
    if (this.SelectedShipment._id != '') this.router.navigate(['/BOL'], { queryParams: { ShipmentId: this.SelectedShipment._id } })
  }
  UploadFile(FileName: string) {
    if (this.SelectedShipment._id != '') {
      this.FileName = FileName;
      document.getElementById('File')?.click();
    }
  }
  SelectFile(event: any) {
    this.SelectedFile = event.target.files[0]
    this.UploadNewShippingDocs();
  }

  async UploadNewShippingDocs() {
    let NewShippingDocs = await ZipHandler.ReplaceFileInShippingDocs(this.SelectedShipment, this.FileName, this.SelectedFile)
    await UploadFile(
      ConstructFormDataFile(NewShippingDocs, 'SD_' + this.SelectedShipment.Invoice.Number + '.zip'),
      'SD_' + this.SelectedShipment.Invoice.Number + '.zip', this.DIS).then(res => { if (res) this.NotificationService.OnSuccess('File Uploaded') })
  }
  OpenPackingListForm() {
    if (this.SelectedShipment._id != '') this.router.navigate(['/Packinglist'], { queryParams: { ShipmentId: this.SelectedShipment._id } })
  }
  GenerateDeclaration() {
    this.router.navigate(['Declaration'], { queryParams: { ShipmentId: this.SelectedShipment._id } })
  }
  GenerateTSCA() {
    this.router.navigate(['TSCA'], { queryParams: { ShipmentId: this.SelectedShipment._id } })
  }
  GenerateGeneralConformityCertificate() {
    this.router.navigate(['GCC'], { queryParams: { ShipmentId: this.SelectedShipment._id } })
  }
  CheckRole() {
    return localStorage.getItem('Role')?.toLowerCase();
  }
  UpdateShipmentStatus(event: any) {
    this.SelectedShipment.Status = event.target.value

    this.spinner.WrapWithSpinner(this.ShipmentService.UpdateShipment(this.SelectedShipment)
      .then(
        res => this.NotificationService.OnSuccess('Status Updated'),
        err => Auth_error_handling(err, this.NotificationService, this.router)))
  }
  DeleteShipment(Shipment: Shipment) {

    if (confirm('Are You Sure You want To Delete This Shipment?')) this.ShipmentService.DeleteShipment(Shipment)
      .then(
        res => this.NotificationService.OnSuccess('Shipment Deleted'),
        err => Auth_error_handling(err, this.NotificationService, this.router))
  }
}
