import { Component, OnInit } from '@angular/core';
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
  selector: 'app-packing-list',
  templateUrl: './packing-list.component.html',
  styleUrls: ['./packing-list.component.sass']
})
export class PackingListComponent implements OnInit {

  TotalQuantity: string = "";
  TotalPacks: string = "";
  TotalKG: string = "";
  TotalCUBM: string = "";
  Shipment: Shipment = new Shipment();
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private ShipmentService: ShipmentService,
    private NotificationService: NotificationserService,
    private router: Router,
    private DIS:DIs,
  ) { }

  ngOnInit(): void {
    this.GetShipment();
  }
  async GetShipment() {
    await this.ActivatedRoute.queryParams.pipe(first()).toPromise().then(async (params: any) => {
      await this.ShipmentService.GetShipmentById(params['ShipmentId'] as string)
        .then(
          (shipment: any) => {
            this.Shipment = shipment
            this.CalculateTotals();
          },
          err => Auth_error_handling(err, this.NotificationService, this.router));
    })
  }
  CalculateTotals(){
    this.Shipment.Invoice.ProductShippingDetails.forEach(row => {
      this.TotalCUBM += row.TOTAL_CUBM
      this.TotalKG += row.TOTAL_KG
      this.TotalPacks += row.TOTAL_PACKS
    })
  }
  async GeneratePackingList() { 
    this.AdjustHtmlPageForFileDisplay();
   let NewShippingDocs =  await ReplaceFileInShippingDocs(this.Shipment,'PackingList.pdf',await this.GeneratePdfFile())
  
   await  UploadFile(
      ConstructFormDataFile(NewShippingDocs, 'SD_' + this.Shipment.Invoice.Number + '.zip'),
      'SD_' + this.Shipment.Invoice.Number + '.zip', this.DIS)
  
   this.router.navigate(['Invoices'])
  }
  async GeneratePdfFile() {
    let HtmlPage = document.getElementById("PDF")
    var pdf = new jsPDF('p', 'pt', [1600, 1600]);

    await pdf.html(HtmlPage ? HtmlPage : '', {
      callback: function () {
        pdf.save('PackingList.pdf');
      }
    });
    return new File([pdf.output('blob')], 'PackingList.pdf', { type: 'application/pdf' })
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
  Format(){
    return FormatUSAAddress(this.Shipment.DeliveryDestination)
  }
}
