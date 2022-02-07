import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import { first } from 'rxjs/operators';
import { Product } from 'src/app/Models/Product';
import { Shipment } from 'src/app/Models/Shipment';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { ShipmentService } from 'src/app/Services/shipment.service';
import { DIs, FormatDate, GetCurrentDate, Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { ConstructFormDataFile, UploadFile } from 'src/app/Utilities/FileHandlers';
import { ReplaceFileInShippingDocs } from 'src/app/Utilities/ZipHandlers';

@Component({
  selector: 'app-tsca-certification',
  templateUrl: './tsca-certification.component.html',
  styleUrls: ['./tsca-certification.component.sass']
})
export class TSCACertificationComponent implements OnInit {

  Shipment: Shipment = new Shipment();
  Products: string[] = [];
  Date: string = FormatDate(Date.now().toString());;

  constructor(
    private ShipmentService: ShipmentService,
    private NotificationService: NotificationserService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private spinner: Spinner,
    private DIS: DIs,
  ) { }

  ngOnInit(): void {
    this.PrepareDataForDisplay()
  }

  async PrepareDataForDisplay() {
    await this.GetShipment();
    this.GetProducts();
  }
  async GetShipment() {
    let ShipmentId: string = "";
    await this.ActivatedRoute.queryParams.pipe(first()).toPromise().then(params => {
      ShipmentId = params['ShipmentId'] as string
    })
    await this.ShipmentService.GetShipmentById(ShipmentId)
      .then(
        (shipment: any) => {
          this.Shipment = shipment
        },
        err => Auth_error_handling(err, this.NotificationService, this.router))
  }
  GetProducts() {
    this.Shipment.Invoice.ProductShippingDetails.forEach(product => this.Products.push(product.PRODUCT))
  }
  async GenerateTSCA() {
    this.AdjustHtmlPageForFileDisplay();
    let NewShippingDocs = await ReplaceFileInShippingDocs(this.Shipment, 'TSCA_Certification.pdf', await this.GeneratePdfFile())

    await UploadFile(
      ConstructFormDataFile(NewShippingDocs, 'SD_' + this.Shipment.Invoice.Number + '.zip'),
      'SD_' + this.Shipment.Invoice.Number + '.zip', this.DIS)

    this.router.navigate(['Invoices'])
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
  async GeneratePdfFile(){
    let HtmlPage = document.getElementById("PDF")
    var pdf = new jsPDF('p', 'pt', [1600, 1600]);

    await pdf.html(HtmlPage ? HtmlPage : '', {
      callback: function () {
        pdf.save('TSCA_Certification.pdf');
      }
    });
    return new File([pdf.output('blob')], 'TSCA_Certification.pdf', { type: 'application/pdf' })
  }

}
