import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Shipment } from 'src/app/Models/Shipment';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { ShipmentService } from 'src/app/Services/shipment.service';
import { DIs, Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { ConstructFormDataFile, UploadFile } from 'src/app/Utilities/FileHandlers';
import * as ZipHandlers from 'src/app/Utilities/ZipHandlers'
@Component({
  selector: 'app-bill-of-lading',
  templateUrl: './bill-of-lading.component.html',
  styleUrls: ['./bill-of-lading.component.sass']
})
export class BillOfLadingComponent implements OnInit {

  Step: boolean = false;
  SelectedFile: any;
  FileName: string = '';
  ShipmentToUpdate: Shipment = new Shipment();
  AllShipments: Shipment[] = [];
  Containers = new FormArray([
    new FormGroup({
      ContainerNumber: new FormControl(),
      Packages: new FormControl()
    })
  ])
  BOLForm = new FormGroup({
    Number: new FormControl('', Validators.required),
    BookingNumber: new FormControl(''),
    Vessel: new FormControl(),
    LoadingPort: new FormControl(),
  })
  constructor(
    private ShipmentService: ShipmentService,
    private spinner: Spinner,
    private NotificationService: NotificationserService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private DIS: DIs,
  ) { }

  ngOnInit(): void {
    this,this.PrepareDataForDisplay();
  }
  async PrepareDataForDisplay() {
    await this.GetAllShipments();
    await this.GetShipment();
    this.AssignShipmentValuesToBOLForm();
  }
  async GetAllShipments() {
    await this.ShipmentService.GetAllShipments()
      .then(
        (shipments: any) => this.AllShipments = shipments,
        err => Auth_error_handling(err, this.NotificationService, this.router))
  }
  async GetShipment() {
    await this.ActivatedRoute.queryParams.pipe(first()).toPromise().then(params => {
      this.ShipmentToUpdate = this.AllShipments.find(shipment => shipment._id == params['ShipmentId'] as string) || new Shipment();
    })
  }
  AssignFormValuesToBOLObject() {
    this.ShipmentToUpdate.BOLNumber = this.BOLForm.get('Number')?.value;
    this.ShipmentToUpdate.BookingNumber = this.BOLForm.get('BookingNumber')?.value;
    this.ShipmentToUpdate.Vessel = this.BOLForm.get('Vessel')?.value;
    this.ShipmentToUpdate.LoadingPort = this.BOLForm.get('LoadingPort')?.value;
  }
  async Submit() {
    this.AssignFormValuesToBOLObject();
    await this.UpdateShipment();
    let NewShippingDocs = await ZipHandlers.ReplaceFileInShippingDocs(this.ShipmentToUpdate, 'BOL.pdf', this.SelectedFile)
    await UploadFile(
      ConstructFormDataFile(NewShippingDocs, 'SD_' + this.ShipmentToUpdate.Invoice.Number + '.zip'),
      'SD_' + this.ShipmentToUpdate.Invoice.Number + '.zip', this.DIS)
    this.router.navigate(['Invoices'])
  }

  OpenFileBrowser() {
    document.getElementById('file')?.click();
  }
  SelectFile(event: any) {
    this.FileName = event.target.files[0].name
    this.SelectedFile = event.target.files[0]
  }
  async UpdateShipment() {
    await this.ShipmentService.UpdateShipment(this.ShipmentToUpdate)
      .then(
        res => {
          this.NotificationService.OnSuccess('Shipment Updated')
          this.router.navigate(['/Invoices'])
        },
        err => Auth_error_handling(err, this.NotificationService, this.router)
      )
  }
  AssignShipmentValuesToBOLForm() {
    this.BOLForm.get('Number')?.setValue(this.ShipmentToUpdate.BOLNumber)
    this.BOLForm.get('BookingNumber')?.setValue(this.ShipmentToUpdate.BookingNumber)
    this.BOLForm.get('Vessel')?.setValue(this.ShipmentToUpdate.Vessel)
    this.BOLForm.get('LoadingPort')?.setValue(this.ShipmentToUpdate.LoadingPort)
  }

}
