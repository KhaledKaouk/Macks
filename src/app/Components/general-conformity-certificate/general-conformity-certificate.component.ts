import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import { first } from 'rxjs/operators';
import { Shipment } from 'src/app/Models/Shipment';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { ShipmentService } from 'src/app/Services/shipment.service';
import { DIs, FormatUSAAddress } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { ConstructFormDataFile, UploadFile } from 'src/app/Utilities/FileHandlers';
import { ReplaceFileInShippingDocs } from 'src/app/Utilities/ZipHandlers';

@Component({
  selector: 'app-general-conformity-certificate',
  templateUrl: './general-conformity-certificate.component.html',
  styleUrls: ['./general-conformity-certificate.component.sass']
})
export class GeneralConformityCertificateComponent implements OnInit {

  Shipment: Shipment = new Shipment();
  AllShipments: Shipment[] = [];
  GCCFrom = new FormGroup({
    ItemNumber: new FormControl('', Validators.required),
    ManufactureDate: new FormControl('', Validators.required),
    TestingDate: new FormControl('', Validators.required),
    LabAddress: new FormControl('', Validators.required),
  })
  constructor(
    private ShipmentService: ShipmentService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private NotificationService: NotificationserService,
    private DIS: DIs,
  ) { }

  ngOnInit(): void {
    this.PreparedataForDisplay();
  }
  async PreparedataForDisplay() {
    await this.GetShipment();
    this.GetShipmentPos();
  }
  async GetShipment() {
    let ShipmentId: string = "";
    await this.ActivatedRoute.queryParams.pipe(first()).toPromise().then(params => {
      ShipmentId = params['ShipmentId'] as string
    })
    await this.ShipmentService.GetShipmentById(ShipmentId)
      .then(
        (shipment: any) => this.Shipment = shipment,
        err => Auth_error_handling(err, this.NotificationService, this.router))
  }
  GetShipmentPos() {
    let PosDealerNumbers: string = ""
    this.Shipment.POs.forEach(po => PosDealerNumbers += " " + po.dealerPoNumber)
    return PosDealerNumbers
  }
  FormatAddress() {
    return FormatUSAAddress(this.Shipment.DeliveryDestination)
  }
  AdjustHtmlPageForFileDisplay() {
    Array.from(document.getElementsByClassName('Draft')).forEach(DraftElement => {
      if (DraftElement.tagName == 'INPUT' || DraftElement.tagName == 'SELECT') {
        (DraftElement as HTMLElement).style.borderColor = '0';
        (DraftElement as HTMLElement).style.borderWidth = '0px';
        (DraftElement as HTMLElement).style.outline = 'none';
      } else {
        DraftElement.remove();
      }
    })
  }
  async GeneratePdfFile() {
    let HtmlPage = document.getElementById("PDF")
    var pdf = new jsPDF('p', 'pt', [1600, 1600]);

    await pdf.html(HtmlPage ? HtmlPage : '', {
      callback: function () {
        pdf.save('General Conformity Certificate.pdf');
      }
    });
    return new File([pdf.output('blob')], 'General Conformity Certificate.pdf', { type: 'application/pdf' })
  }
  async GenerateGCC() {
    this.AdjustHtmlPageForFileDisplay();
    let NewShippingDocs = await ReplaceFileInShippingDocs(this.Shipment, 'General Conformity Certificate.pdf', await this.GeneratePdfFile());
    await UploadFile(
      ConstructFormDataFile(NewShippingDocs, 'SD_' + this.Shipment.Invoice.Number + '.zip'),
      'SD_' + this.Shipment.Invoice.Number + '.zip', this.DIS)

    this.router.navigate(['Invoices'])
  }
}
