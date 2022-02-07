import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrdouctShippingDetailsComponent } from '../prdouct-shipping-details/prdouct-shipping-details.component';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from "rxjs/operators";
import { DIs, FormatDate, Spinner } from 'src/app/Utilities/Common';
import { ProductShippingDetails } from 'src/app/Models/CommercialInvoice';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Invoice } from 'src/app/Models/Invoice';
import { InvoiceService } from 'src/app/Services/invoice.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { POsService } from 'src/app/Services/pos.service';
import { POs } from 'src/app/Models/Po-model';
import { Shipment } from 'src/app/Models/Shipment';
import { ShipmentService } from 'src/app/Services/shipment.service';
import { CombineFilesInZip, ConstructFormDataFile, GenerateZipBlob, UploadFile } from 'src/app/Utilities/FileHandlers';
import { APIURL } from 'src/app/Utilities/Variables';
import * as JSZip from 'jszip';
import * as ZipHandler from 'src/app/Utilities/ZipHandlers'


@Component({
  selector: 'app-commercial-innvoice',
  templateUrl: './commercial-innvoice.component.html',
  styleUrls: ['./commercial-innvoice.component.sass']
})
export class CommercialInnvoiceComponent implements OnInit {

  InvoiceNumber: string = ""
  InvoiceDate: string = FormatDate(Date.now().toString());
  PS_Details: ProductShippingDetails[] = [];

  TotalQuantity: number = 0;
  TotalPacks: number = 0;
  TotalKG: number = 0;
  TotalCUBM: number = 0;
  TotalPrice: number = 0;
  FreightPrice: number = 0;
  GrantTotal: number = 0;
  POs: string[] = [];
  PosIds: string[] = [];
  AllPos: POs[] = [];
  NewShipment: Shipment = new Shipment();
  ShipmentToUpdate: Shipment = new Shipment();
  ShippingDocs: any;
  DeliveryDestination: string = "";
  InvoicePOs: string[] = [];
  PoFileNames: string[] = []
  CostumerAddressPart1: string = "";
  CostumerAddressPart2: string = "";
  CostumerAddressPart3: string = "";
  Port = "";
  NewInvoice: Invoice = new Invoice();
  InvoiceToUpdate: Invoice = new Invoice();
  Containers = new FormArray([
  ])
  InvoiceForm = new FormGroup({
    Number: new FormControl('', Validators.required),
    FreightPrice: new FormControl(),
    PaymentMethod: new FormControl(),
    Containers: this.Containers
  })
  constructor(
    private dialog: MatDialog,
    private ActivatedRoute: ActivatedRoute,
    private InvoiceService: InvoiceService,
    private PosService: POsService,
    private ShipmentService: ShipmentService,
    private Notificationservice: NotificationserService,
    private router: Router,
    private spinner: Spinner,
    private DIs: DIs,
  ) { }

  AddContainer() {
    this.Containers.push(new FormControl('', Validators.required))
  }
  DeleteContainer(i: number) {
    this.Containers.removeAt(i)
  }
  ngOnInit(): void {
    this.PrepareDataForDisplay();
  }
  async PrepareDataForDisplay() {
    await this.CreateCommercialInvoice()
    await this.GetPOs();
  }

  async GetPOs() {
    await this.PosService.GetPos()
      .then(
        (pos: any) => {
          this.AllPos = pos
        },
        err => Auth_error_handling(err, this.Notificationservice, this.router))
    this.GetShipment();
  }
  CreateNewShipment() {
    this.NewShipment.POs = this.AllPos.filter(po => this.PosIds.includes(po._id));
    this.NewShipment.Invoice = this.NewInvoice;
    this.NewShipment.DischargePort = this.Port;
    this.NewShipment.Status = "Container Booked"
    this.NewShipment.ContainerNumbers = this.InvoiceForm.get('Containers')?.value
    this.NewShipment.DeliveryDestination = this.DeliveryDestination;
  }
  UpdateShipment() {
    this.ShipmentToUpdate.POs = this.AllPos.filter(po => this.PosIds.includes(po._id));
    this.ShipmentToUpdate.Invoice = this.InvoiceToUpdate;
    this.ShipmentToUpdate.DischargePort = this.Port;
    this.ShipmentToUpdate.Status = "Container Booked";
    this.ShipmentToUpdate.ContainerNumbers = this.InvoiceForm.get('Containers')?.value
    this.ShipmentToUpdate.DeliveryDestination = this.DeliveryDestination;

  }
  async CreateCommercialInvoice() {
    await this.GetPoFileNamesAndPortAndIds();
    for (let PoFileName of Array.from(this.PoFileNames)) {
      let PO = await this.getPO(PoFileName)
      await this.GetProductDetailsFromPoFile(await this.GetWorkSheet(PO))
      this.GetCustomerAddress(await this.GetWorkSheet(PO))
    }
    this.CalculateTotals(this.PS_Details);
  }
  async GetPoFileNamesAndPortAndIds() {
    await this.ActivatedRoute.queryParams.pipe(first()).toPromise().then(params => {
      this.PoFileNames = params['IP'] as string[]
      this.Port = params['Port'] as string
      this.PosIds = params['PosIds'] as string[]

    })
  }
  async getPO(POFileName: string) {
    let ResponseWithPoBlob = await fetch(APIURL + 'Assets/NP/' + POFileName)
    let POBlob = await ResponseWithPoBlob.clone().blob();

    let POFile: any
    POFile = POBlob;
    POFile.name = "PO";
    POFile.lastModifiedDate = new Date();

    return POFile as File;
  }
  async GetWorkSheet(POFile: File) {
    let arrayBuffer: any;
    await POFile.arrayBuffer().then((buffer) => { arrayBuffer = buffer })
    var data = new Uint8Array(arrayBuffer);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
    var workbook = XLSX.read(bstr, { type: "binary" });
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    return worksheet
  }
  async GetShipment() {
    let ShipmentId = this.AllPos.find(po => po._id == this.PosIds[0])?.ShipmentId || '';
    if (ShipmentId != '') await this.ShipmentService.GetShipmentById(ShipmentId)
      .then((shipment: any) => {
        this.ShipmentToUpdate = shipment;
        this.PS_Details = shipment.Invoice.ProductShippingDetails
        this.InvoiceForm.get('Number')?.setValue(shipment.Invoice.Number)
        this.InvoiceForm.get('FreightPrice')?.setValue(shipment.Invoice.FreightPrice)
        this.InvoiceForm.get('PaymentMethod')?.setValue(shipment.Invoice.PaymentMethod)
        shipment.ContainerNumbers.forEach((C: any) => this.Containers.push(new FormControl('', Validators.required)))
        this.InvoiceForm.get('Containers')?.setValue(shipment.ContainerNumbers)
      })
    this.CalculateTotals(this.PS_Details);

  }


  async GetProductDetailsFromPoFile(WorkSheet: XLSX.WorkSheet) {
    let CellIndexEnd = this.GetLastProductIndex(WorkSheet)
    let CellIndex: number = 18
    while (CellIndex <= CellIndexEnd) {
      let PSD = new ProductShippingDetails();

      PSD.QTY = WorkSheet['A' + CellIndex.toString()].v
      PSD.PRODUCT_CODE = WorkSheet['D' + CellIndex.toString()].v
      PSD.PRODUCT = WorkSheet['E' + CellIndex.toString()].v
      PSD.Po = WorkSheet['P5'].v

      if (!this.CheckPoInPoList(PSD.Po)) this.POs.push(PSD.Po)

      this.PS_Details.push(PSD)

      CellIndex += 1;
    }
  }
  GetLastProductIndex(Worksheet: XLSX.WorkSheet) {
    let QTY: string = ''
    let CellIndex: number = 18;
    while (QTY != null) {
      QTY = Worksheet['A' + CellIndex.toString()] ? Worksheet['A' + CellIndex.toString()] : null
      CellIndex += 1;
    }
    return CellIndex - 3
  }
  async GetCustomerAddress(WorkSheet: XLSX.WorkSheet) {
    this.CostumerAddressPart1 = WorkSheet['L10'].v
    this.CostumerAddressPart2 = WorkSheet['L11'].v
    this.CostumerAddressPart3 = WorkSheet['L12'].v
    this.DeliveryDestination = WorkSheet['L10'].v + "," + WorkSheet['L11'].v + "," + WorkSheet['L12'].v
  }
  CheckPoInPoList(Po: string) {
    return this.POs.includes(Po)
  }

  async EditeProductDetails(CommercialInvoiceRow: ProductShippingDetails) {
    await this.dialog.open(PrdouctShippingDetailsComponent, {
      height: '60rem',
      width: '60rem',
      data: CommercialInvoiceRow
    }).afterClosed().toPromise().then((PS_Details: any) => {
      this.PS_Details[this.PS_Details.indexOf(CommercialInvoiceRow)] = PS_Details.data as ProductShippingDetails;
    })
    this.CalculateTotals(this.PS_Details);
  }
  CalculateTotals(PS_Details: ProductShippingDetails[]) {
    this.ZeroTotals()
    PS_Details.forEach(PS_D => {
      this.TotalQuantity += PS_D.QTY;
      this.TotalPacks += PS_D.TOTAL_PACKS
      this.TotalKG += PS_D.TOTAL_KG
      this.TotalCUBM += PS_D.TOTAL_CUBM;
      this.TotalPrice += PS_D.TOTAL_PRICE
    })
  }
  ZeroTotals() {
    this.TotalQuantity = 0;
    this.TotalPacks = 0;
    this.TotalKG = 0;
    this.TotalCUBM = 0;
    this.TotalPrice = 0;
  }
  AssignFreightPrice(event: any) {
    this.FreightPrice = event.target.value
    this.GrantTotal = parseFloat(this.FreightPrice.toString()) + parseFloat(this.TotalPrice.toString())
  }


  async GenerateInvoice() {
    if (this.ShipmentToUpdate._id != '') {
      this.GenerateUpatedInvoice();
    } else {
      this.CreateInvoice();

      this.CreateNewShipment();
      let NewShipmentId: string = "Unavailable";
      NewShipmentId = await this.PostShipment();

      this.NewInvoice.ShipmentId = NewShipmentId;
      await this.PostInvoice();

      this.AdjustHtmlPageForFileDisplay();

      let pdf = await this.GeneratePdfFile();
      let file: File = this.CreateInvoiceFile(pdf);
      await this.UploadInvoiceFile(file)
      this.router.navigate(['/ISF'], { queryParams: { Pos: this.PosIds, ShipmentId: NewShipmentId } })
    }
  }
  async GenerateUpatedInvoice() {
    this.UpdateInvoice();
    this.PostUpdateInvoice();

    this.UpdateShipment();
    this.PostUpdateShipment();

    this.AdjustHtmlPageForFileDisplay();

    let pdf = await this.GeneratePdfFile();
    let file: File = this.CreateInvoiceFile(pdf);
    this.ShippingDocs = await this.GetShippingDocs();
    let JsZipShippingDocs = await this.GetJSZipShippingDocs(this.ShippingDocs);
    JsZipShippingDocs.remove('Invoice.pdf');
    JsZipShippingDocs.file(file.name, file)
    let NewShippingDocs = await GenerateZipBlob(JsZipShippingDocs);

    this.spinner.WrapWithSpinner(
      UploadFile(
        ConstructFormDataFile(NewShippingDocs, 'SD_' + this.ShipmentToUpdate.Invoice.Number + '.zip'),
        'SD_' + this.ShipmentToUpdate.Invoice.Number + '.zip', this.DIs)
    )
    this.router.navigate(['Invoices'])
  }
  async GetJSZipShippingDocs(ShippingDocs: File) {
    let CopyOfShippingDocs = new JSZip();
    let OldDocs = await ZipHandler.Unzip(ShippingDocs)

    OldDocs.forEach(file => {
      if (this.GetFileExtenstion(file) != 'zip') {
        CopyOfShippingDocs.file(file.name, file)
      }
    })
    return CopyOfShippingDocs
  }
  async GeneratePdfFile() {
    let HtmlPage = document.getElementById("PDF")
    var pdf = new jsPDF('p', 'pt', [1600, 1600]);

    await pdf.html(HtmlPage ? HtmlPage : '', {
      callback: function () {
        pdf.save('CommercialInvoice.pdf');
      }
    });
    return pdf
  }
  CreateInvoiceFile(PdfFile: jsPDF) {
    return new File([PdfFile.output('blob')], 'Invoice.pdf', { type: 'application/pdf' });
  }
  CreateInvoice() {
    this.NewInvoice.Number = this.InvoiceForm.get('Number')?.value;
    this.NewInvoice.ProductsPrice = this.TotalPrice;
    this.NewInvoice.BankDetails = "ZIRAAT BANKASI / IZMIR COMMERCIAL BRANCH, IZMIR, TURKEY";
    this.NewInvoice.Date = this.InvoiceDate;
    this.NewInvoice.IBANNo = "TR350001001751532978585010";
    this.NewInvoice.SwiftCode = "TCZBTR2A";
    this.NewInvoice.FreightPrice = this.InvoiceForm.get('FreightPrice')?.value;
    this.NewInvoice.PaymentMethod = this.InvoiceForm.get('PaymentMethod')?.value;
    this.NewInvoice.ProductShippingDetails = this.PS_Details;
  }
  UpdateInvoice() {
    this.InvoiceToUpdate._id = this.ShipmentToUpdate.Invoice._id;
    this.InvoiceToUpdate.Number = this.InvoiceForm.get('Number')?.value;
    this.InvoiceToUpdate.ProductsPrice = this.TotalPrice;
    this.InvoiceToUpdate.BankDetails = "ZIRAAT BANKASI / IZMIR COMMERCIAL BRANCH, IZMIR, TURKEY";
    this.InvoiceToUpdate.Date = this.InvoiceDate;
    this.InvoiceToUpdate.IBANNo = "TR350001001751532978585010";
    this.InvoiceToUpdate.SwiftCode = "TCZBTR2A";
    this.InvoiceToUpdate.FreightPrice = this.InvoiceForm.get('FreightPrice')?.value;
    this.InvoiceToUpdate.PaymentMethod = this.InvoiceForm.get('PaymentMethod')?.value;
    this.InvoiceToUpdate.ProductShippingDetails = this.PS_Details;
  }
  PostUpdateInvoice() {
    this.spinner.WrapWithSpinner(this.InvoiceService.UpdateInvoice(this.InvoiceToUpdate)
      .then(
        res => this.Notificationservice.OnSuccess("Invoice Created"),
        err => Auth_error_handling(err, this.Notificationservice, this.router
        )))
  }
  async PostInvoice() {
    this.spinner.WrapWithSpinner(this.InvoiceService.CreateInvoice(this.NewInvoice)
      .then(
        res => this.Notificationservice.OnSuccess("Invoice Created"),
        err => Auth_error_handling(err, this.Notificationservice, this.router
        )))
  }
  async UploadInvoiceFile(file: File) {
    let InvoiceZip = await CombineFilesInZip([file])
    UploadFile(
      ConstructFormDataFile(InvoiceZip, 'SD_' + this.NewInvoice.Number + '.zip'),
      'SD_' + this.NewInvoice.Number + '.zip',
      this.DIs)
  }
  async PostShipment() {
    let NewShipmentId: string = '';
    await this.ShipmentService.CreatShipment(this.NewShipment)
      .then(
        (ShipmentId: any) => {
          this.Notificationservice.OnSuccess('Shipment Created')
          NewShipmentId = ShipmentId;
        },
        err => Auth_error_handling(err, this.Notificationservice, this.router
        ));

    return NewShipmentId
  }
  PostUpdateShipment() {
    this.ShipmentService.UpdateShipment(this.ShipmentToUpdate)
      .then(
        (ShipmentId: any) => {
          this.Notificationservice.OnSuccess('Shipment Created')
        },
        err => Auth_error_handling(err, this.Notificationservice, this.router
        ));
  }
  AdjustHtmlPageForFileDisplay() {
    Array.from(document.getElementsByClassName('Draft')).forEach(DraftElement => {
      if (DraftElement.tagName == 'INPUT' || DraftElement.tagName == 'SELECT') {
        (DraftElement as HTMLElement).style.borderColor = '0';
        (DraftElement as HTMLElement).style.borderWidth = '0px';
      } else {
        DraftElement.remove();
      }
    })
  }
  async GetShippingDocs() {
    let ShippingDocsFile: any;

    let ResponseWithShippingDocsBlob = await fetch(APIURL + 'Assets/SD/' + 'SD_' + this.ShipmentToUpdate.Invoice.Number + '.zip')
    let ShippingDocsBlob = await ResponseWithShippingDocsBlob.clone().blob();

    ShippingDocsFile = ShippingDocsBlob;
    ShippingDocsFile.name = this.ShipmentToUpdate.Invoice.Number + '.zip'
    ShippingDocsFile.lastModifiedDate = new Date();

    return ShippingDocsFile as File
  }
  GetFileExtenstion(file: File) {
    let indexOExtention = file.name.indexOf('.') + 1;
    return file.name.substring(indexOExtention, file.name.length)
  }
  ChangeProductQuantity(index: number, event: any) {
    this.PS_Details[index].QTY = event.target.value
  }
}
