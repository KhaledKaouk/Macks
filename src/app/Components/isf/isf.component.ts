import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import * as JSZip from 'jszip';
import { first } from 'rxjs/operators';
import { POs } from 'src/app/Models/Po-model';
import { Shipment } from 'src/app/Models/Shipment';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { ShipmentService } from 'src/app/Services/shipment.service';
import { DIs, FormatUSAAddress, Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { ConstructFormDataFile, GenerateZipBlob, UploadFile } from 'src/app/Utilities/FileHandlers';
import { APIURL } from 'src/app/Utilities/Variables';
import * as ZipHandler from 'src/app/Utilities/ZipHandlers'

@Component({
  selector: 'app-isf',
  templateUrl: './isf.component.html',
  styleUrls: ['./isf.component.sass']
})
export class ISFComponent implements OnInit {

  ISFForm = new FormGroup({
    ETD: new FormControl(),
    ETA: new FormControl(),
    MBL: new FormControl(),
    HBL: new FormControl(),
    OtherHBL: new FormControl(),
    HTS: new FormControl(),
    Pos: new FormControl(),
    ContainerNumbers: new FormControl(),
  })
  ShipmentPos: POs[] = [];
  PosIds: string[] = [];
  ShipmentId: string = "Unavailable";
  Shipment: Shipment = new Shipment();
  ShippingDocs: any;
  ContainerNumbers: string = "";
  constructor(
    private PosService: POsService,
    private ShipmentService: ShipmentService,
    private ActivatedRoute: ActivatedRoute,
    private NotificationService: NotificationserService,
    private router: Router,
    private DIS: DIs,
    private spinner: Spinner,
  ) { }

  ngOnInit(): void {
    this.SetUpPosForDisplay();
  }

  async SetUpPosForDisplay() {
    await this.GetPoIdsAndShipmentId();
    await this.GetShipment();
    await this.GetShipmentPos();
    this.SetPosIntoForm();
    this.AssignFormValuesToShipmentObject
    this.ShippingDocs = await this.GetShippingDocs();
  }
  AssignFormValuesToShipmentObject() {
    this.Shipment.ETD = this.ISFForm.get('ETD')?.value
    this.Shipment.ETA = this.ISFForm.get('ETA')?.value
    this.Shipment.MBL = this.ISFForm.get('MBL')?.value
    this.Shipment.HBL = this.ISFForm.get('HBL')?.value
    this.Shipment.HTS = this.ISFForm.get('HTS')?.value
  }
  AssignShipmentValuesToForm() {
    this.ISFForm.get('ETD')?.setValue(this.Shipment.ETD)
    this.ISFForm.get('ETA')?.setValue(this.Shipment.ETA)
    this.ISFForm.get('MBL')?.setValue(this.Shipment.MBL)
    this.ISFForm.get('HBL')?.setValue(this.Shipment.HBL)
    this.ISFForm.get('HTS')?.setValue(this.Shipment.HTS)
    this.CombineContainerNumbersInString(this.Shipment);
    this.ISFForm.get('ContainerNumbers')?.setValue(this.ContainerNumbers)
  }
  async GetShipment() {
    await this.ShipmentService.GetShipmentById(this.ShipmentId)
      .then(
        (shipment: any) => {
          this.Shipment = shipment
          this.AssignShipmentValuesToForm();
        },
        err => Auth_error_handling(err, this.NotificationService, this.router)
      )
  }
  async GetShipmentPos() {
    await this.PosService.GetPos()
      .then(
        (Pos: any) => {
          this.ShipmentPos = Pos
          this.ShipmentPos = this.ShipmentPos.filter(Po => this.PosIds.includes(Po._id))
        },
        (err) => { Auth_error_handling(err, this.NotificationService, this.router) }
      )
  }
  SetPosIntoForm() {
    let PosNumbers: string = "";
    this.ShipmentPos.forEach(Po => PosNumbers += "  " + Po.dealerPoNumber)
    this.ISFForm.get('Pos')?.setValue(PosNumbers)
  }
  async GetPoIdsAndShipmentId() {
    await this.ActivatedRoute.queryParams.pipe(first()).toPromise().then(params => {
      this.PosIds = params['Pos'] as string[];
      this.ShipmentId = params['ShipmentId'] as string;
    })
  }
  async GenerateISF() {
    this.AssignFormValuesToShipmentObject();

    await this.UpdateShipment();

    this.AdjustHtmlPageForFileDisplay();
    let pdf = await this.GeneratePdfFile()
    let JsZipShippingDocs = await this.GetJSZipShippingDocs(this.ShippingDocs);

    let file = this.CreateISFFile(pdf);

    JsZipShippingDocs.remove('ISF.pdf')

    JsZipShippingDocs.file(file.name, file)
    let NewShippingDocs = await GenerateZipBlob(JsZipShippingDocs);

    this.spinner.WrapWithSpinner(
      UploadFile(
        ConstructFormDataFile(NewShippingDocs, 'SD_' + this.Shipment.Invoice.Number + '.zip'),
        'SD_' + this.Shipment.Invoice.Number + '.zip', this.DIS)
    )
    this.router.navigate(['Invoices'])

  }

  CreateISFFile(PdfFile: jsPDF) {
    return new File([PdfFile.output('blob')], 'ISF.pdf', { type: 'application/pdf' });
  }
  async GeneratePdfFile() {
    let HtmlPage = document.getElementById("PDF")
    var pdf = new jsPDF('p', 'pt', [1600, 1600]);

    await pdf.html(HtmlPage ? HtmlPage : '', {
      callback: function () {
        pdf.save('ISF.pdf');
      }
    });
    return pdf
  }
  async GetShippingDocs() {
    let ShippingDocsFile: any;

    let ResponseWithShippingDocsBlob = await fetch(APIURL + 'Assets/SD/' + 'SD_' + this.Shipment.Invoice.Number + '.zip')
    let ShippingDocsBlob = await ResponseWithShippingDocsBlob.clone().blob();

    ShippingDocsFile = ShippingDocsBlob;
    ShippingDocsFile.name = this.Shipment.Invoice.Number + '.zip'
    ShippingDocsFile.lastModifiedDate = new Date();

    return ShippingDocsFile as File
  }
  async GetJSZipShippingDocs(OldShippingDocs: File) {
    let CopyOfShippingDocs = new JSZip();
    let OldDocs = await ZipHandler.Unzip(OldShippingDocs)

    OldDocs.forEach(file => {
      if (this.GetFileExtenstion(file) != 'zip') {
        CopyOfShippingDocs.file(file.name, file)
      }
    })
    return CopyOfShippingDocs

  }
  GetFileExtenstion(file: File) {
    let indexOExtention = file.name.indexOf('.') + 1;
    return file.name.substring(indexOExtention, file.name.length)
  }
  async UpdateShipment() {
    await this.ShipmentService.UpdateShipment(this.Shipment)
      .then(
        res => this.NotificationService.OnSuccess('Shipment Updated'),
        err => Auth_error_handling(err, this.NotificationService, this.router)
      )
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
  CombineContainerNumbersInString(Shipment: Shipment){
    Shipment.ContainerNumbers.forEach(container => this.ContainerNumbers += "   " + container)
  }
  FormatAddress(){
    return FormatUSAAddress(this.Shipment.DeliveryDestination)
  }
}
