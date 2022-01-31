import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import { first } from 'rxjs/operators';
import { Dealers } from 'src/app/Models/Dealers';
import { Shipment } from 'src/app/Models/Shipment';
import { DealersService } from 'src/app/Services/dealers.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { ShipmentService } from 'src/app/Services/shipment.service';
import { DIs, FormatUSAAddress, Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { ConstructFormDataFile, UploadFile } from 'src/app/Utilities/FileHandlers';
import { ReplaceFileInShippingDocs } from 'src/app/Utilities/ZipHandlers';

@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.sass']
})
export class DeclarationComponent implements OnInit {

  ShipmentId: string = "";
  Shipments: Shipment[] = [];
  Shipment: Shipment = new Shipment();
  Dealers: Dealers[] = []
  DealerName: string = "";
  ContainerNumbers: string = "";

  constructor(
    private ShipmentService: ShipmentService,
    private DealerService: DealersService,
    private NotificationService: NotificationserService,
    private router: Router,
    private DIS: DIs,
    private spinner: Spinner,
    private ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.PrepareShipmentDataForDisplay();
  }
  async GetShipmentId() {
    await this.ActivatedRoute.queryParams.pipe(first()).toPromise().then(params => {
      this.ShipmentId = params['ShipmentId'] as string;
    })
  }
  async GetShipments() {
    await this.ShipmentService.GetAllShipments()
      .then((shipments: any) => this.Shipments = shipments,
        err => Auth_error_handling(err, this.NotificationService, this.router))
  }
  GetShipment() {
    this.Shipment = this.Shipments.find(shipment => shipment._id == this.ShipmentId) || new Shipment();
  }
  async GetDealers() {
    this.DealerService.GetAllDealers()
      .then((dealers: any) => this.Dealers = dealers,
        err => Auth_error_handling(err, this.NotificationService, this.router))
  }
  GetDealerName() {
    this.DealerName = this.Dealers.find(dealer => dealer._id == this.Shipment.POs[0].dealer_id)?.name || "";
  }
  async PrepareShipmentDataForDisplay() {
    await this.GetShipmentId();
    await this.GetShipments();
    this.GetShipment();
    this.CombineContainerNumbersInString();
    await this.GetDealers();
    this.GetDealerName();
  }
  AdjustHtmlForFileDisplay() {
    Array.from(document.getElementsByClassName('Draft')).forEach(DraftElement => {
      if (DraftElement.tagName == 'INPUT' || DraftElement.tagName == 'SELECT') {
        (DraftElement as HTMLElement).style.borderColor = '0';
        (DraftElement as HTMLElement).style.borderWidth = '0px';
      } else {
        DraftElement.remove();
      }
    })
  }
  async UploadNewShippingDocs(NewShippingDocs: Blob) {
    await UploadFile(
      ConstructFormDataFile(NewShippingDocs, 'SD_' + this.Shipment.Invoice.Number + '.zip'),
      'SD_' + this.Shipment.Invoice.Number + '.zip', this.DIS)
  }
  async Submit() {
    this.AdjustHtmlForFileDisplay();

    let NewShippingDocs = await ReplaceFileInShippingDocs(this.Shipment, 'DECLARATION.pdf', await this.GenerateDeclarationFile())

    await this.UploadNewShippingDocs(NewShippingDocs)

    this.router.navigate(['Invoices'])

  }
  async GenerateDeclarationFile() {
    let HtmlPage = document.getElementById("PDF")
    var pdf = new jsPDF('p', 'pt', [2000, 1600]);

    await pdf.html(HtmlPage ? HtmlPage : '', {
      callback: function () {
        pdf.save('Declaration.pdf');
      }
    });
    return new File([pdf.output('blob')], 'DECLARATION.pdf', { type: 'application/pdf' })
  }
  FormatAddress() {
    return FormatUSAAddress(this.Shipment.DeliveryDestination)
  }
  CombineContainerNumbersInString() {
    this.Shipment.ContainerNumbers.forEach(container => this.ContainerNumbers += "   " + container)
  }
}
