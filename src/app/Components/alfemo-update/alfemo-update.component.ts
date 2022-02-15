import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as JSZip from 'jszip';
import { POs } from 'src/app/Models/Po-model';
import { port } from 'src/app/Models/port';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { PortService } from 'src/app/Services/port.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { DIs, FormatDate, Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import * as FileHandler from 'src/app/Utilities/FileHandlers';
import { APIURL, Status } from 'src/app/Utilities/Variables';
import * as ZipHandler from 'src/app/Utilities/ZipHandlers'
@Component({
  selector: 'app-alfemo-update',
  templateUrl: './alfemo-update.component.html',
  styleUrls: ['./alfemo-update.component.css']
})
export class AlfemoUpdateComponent implements OnInit {

  UpdatedPo = new FormGroup({
    Status: new FormControl(''),
    ContainerNumber: new FormControl(''),
    ProductionStartDate: new FormControl(''),
    ProductionFinishDate: new FormControl(''),
    FactoryLoadDate: new FormControl(''),
    DateOfDeparture: new FormControl(''),
    FinalDestination: new FormControl(''),
    FactoryEstimatedArrivalDate: new FormControl(''),
    FactoryEstimatedShipDate: new FormControl(''),
    AlfemoComents: new FormControl(''),
    port: new FormControl(''),
  })

  Route: string = "Assets/SD/"
  PoToUpdate: POs = new POs();
  ShippingDocsAreEdited: boolean = false;
  SeletedFile: any;
  ArchivedFiles: any;
  AddtitionalShippingDocs: any;
  NewShippingDocs = new JSZip();
  ArchivedShippingDocs = new JSZip();
  FilesNames: string[] = [];
  POHasShippingDocsFile: boolean = false;
  AllPorts: port[] = [];

  constructor(private PoService: POsService,
    private Notification: NotificationserService,
    private PortService: PortService,
    private dialogref: MatDialogRef<AlfemoUpdateComponent>,
    private router: Router,
    private spinner: Spinner,
    private DIs: DIs,
    @Inject(MAT_DIALOG_DATA) public data: POs) { }

  ngOnInit(): void {
    CheckToken(this.router);

    this.PoToUpdate = this.data;
    this.CheckForCancelRequests()
    this.CheckForHoldRequest()
    this.GetPorts();
    this.AssignPoDataToForm();

    this.POHasShippingDocsFile = this.CheckPoShippingDocsFile()
    this.ConfigureShippingDocsForUserControl();
  }
  async GetPorts() {
    await this.PortService.GetPorts().then((ports: any) => this.AllPorts = ports)
  }
  AssignPoDataToForm() {
    this.UpdatedPo.setValue({
      Status: this.data.status,
      ContainerNumber: this.data.containerNumber,
      FinalDestination: this.data.finalDestLocation,
      ProductionStartDate: FormatDate(this.data.productionStartDate),
      ProductionFinishDate: FormatDate(this.data.productionFinishDate),
      FactoryLoadDate: FormatDate(this.data.factoryLoadDate),
      DateOfDeparture: FormatDate(this.data.dateOfDeparture),
      FactoryEstimatedArrivalDate: FormatDate(this.data.factoryEstimatedArrivalDate),
      FactoryEstimatedShipDate: FormatDate(this.data.factoryEstimatedShipDate),
      AlfemoComents: this.data.alfemoComments,
      port: this.data.port
    })
  }
  AssignformValuesToObject() {
    this.PoToUpdate.status = this.UpdatedPo.get('Status')?.value;
    this.PoToUpdate.containerNumber = this.UpdatedPo.get('ContainerNumber')?.value;
    this.PoToUpdate.finalDestLocation = this.UpdatedPo.get('FinalDestination')?.value;
    this.PoToUpdate.productionStartDate = this.UpdatedPo.get('ProductionStartDate')?.value;
    this.PoToUpdate.productionFinishDate = this.UpdatedPo.get('ProductionFinishDate')?.value;
    this.PoToUpdate.factoryLoadDate = this.UpdatedPo.get('FactoryLoadDate')?.value;
    this.PoToUpdate.dateOfDeparture = this.UpdatedPo.get('DateOfDeparture')?.value
    this.PoToUpdate.factoryEstimatedArrivalDate = this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.value;
    this.PoToUpdate.factoryEstimatedShipDate = this.UpdatedPo.get('FactoryEstimatedShipDate')?.value;
    this.PoToUpdate.alfemoComments = this.UpdatedPo.get('AlfemoComents')?.value;
    this.PoToUpdate.port = this.UpdatedPo.get('port')?.value
  }

  async Submit() {
    let UploadShippingDocs: any;

    this.AssignformValuesToObject();

    await this.GenerateShippingDocsBlobs();

    if (this.SeletedFile) {
      this.AssignFileToPo()

      UploadShippingDocs = await this.UploadShippingDocsFiles();

      if (UploadShippingDocs == true) {
        this.UpdatePo();
      }
    } else {
      this.UpdatePo();
    }
  }
  async UploadShippingDocsFiles() {
    let UploadShippingDocs: any;
    UploadShippingDocs = await FileHandler.UploadFile(
      FileHandler.ConstructFormDataFile(this.SeletedFile, FileHandler.ConstructFileName(this.PoToUpdate, "SD_", "Example.zip")),
      FileHandler.ConstructFileName(this.PoToUpdate, "SD_", "Example.zip"),
      this.DIs,
      this.dialogref
    )
    if (this.ShippingDocsAreEdited) {
      await FileHandler.UploadFile(
        FileHandler.ConstructFormDataFile(this.ArchivedFiles, FileHandler.ConstructFileName(this.PoToUpdate, "Archive_", 'Example.zip')),
        FileHandler.ConstructFileName(this.PoToUpdate, "Archive_", 'Example.zip'),
        this.DIs,
        this.dialogref
      )
    }
    return UploadShippingDocs
  }
  UpdatePo() {
    if (!this.NotifyUserOnMissingShippingDocs()) this.spinner.WrapWithSpinner(
      this.PoService.UpdatePo(this.PoToUpdate)
        .toPromise()
        .then(
          res => this.DisplayNotifications(res),
          err => Auth_error_handling(err, this.Notification, this.router)
        ),
      this.dialogref)
  }

  AssignFileToPo() {
    this.PoToUpdate.shippingDocs = FileHandler.ConstructFileName(this.PoToUpdate, "SD_", "Example.zip");
  }
  async GenerateShippingDocsBlobs() {
    if (this.ShippingDocsAreEdited == true) {
      this.SeletedFile = await FileHandler.GenerateZipBlob(this.NewShippingDocs);
      this.ArchivedFiles = await FileHandler.GenerateZipBlob(this.ArchivedShippingDocs);
    }
    if (this.SeletedFile && !this.ShippingDocsAreEdited) this.SeletedFile = await FileHandler.CombineFilesInZip(this.SeletedFile);

  }
  SaveFileInObject(event: any) {
    this.SeletedFile = event.target.files;
  }

  AssignValidators(event: any) {
    if (event.target.value == "Shipped") {
      alert("you have to fill the following fields to update this Po:\n 1 - EstimatedArrivalDate\n 2 - EstimatedShipDate\n 3 - container no\n 4 - Shipping Document")
      this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.setValidators(Validators.required);
      this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.updateValueAndValidity();
      this.UpdatedPo.get('FactoryEstimatedShipDate')?.setValidators(Validators.required);
      this.UpdatedPo.get('FactoryEstimatedShipDate')?.updateValueAndValidity();
      this.UpdatedPo.get('ContainerNumber')?.setValidators(Validators.required);
      this.UpdatedPo.get('ContainerNumber')?.updateValueAndValidity();
      this.UpdatedPo.get('FinalDestination')?.setValidators(Validators.required);
      this.UpdatedPo.get('FinalDestination')?.updateValueAndValidity();

    } else {
      this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.clearValidators()
      this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.updateValueAndValidity();
      this.UpdatedPo.get('FactoryEstimatedShipDate')?.clearValidators()
      this.UpdatedPo.get('FactoryEstimatedShipDate')?.updateValueAndValidity();
      this.UpdatedPo.get('ContainerNumber')?.clearValidators()
      this.UpdatedPo.get('ContainerNumber')?.updateValueAndValidity();
      this.UpdatedPo.get('FinalDestination')?.clearValidators();
      this.UpdatedPo.get('FinalDestination')?.updateValueAndValidity();

    }
  }

  async GetShippingDocs() {
    let ShippingDocsFile: any;

    let ResponseWithShippingDocsBlob = await fetch(APIURL + this.Route + this.PoToUpdate.shippingDocs)
    let ShippingDocsBlob = await ResponseWithShippingDocsBlob.clone().blob();

    ShippingDocsFile = ShippingDocsBlob;
    ShippingDocsFile.name = this.PoToUpdate.shippingDocs
    ShippingDocsFile.lastModifiedDate = new Date();

    return ShippingDocsFile as File
  }
  DisplayShippingDocs(ShippingDocsZip: File) {
    ZipHandler.Unzip(ShippingDocsZip).then(Files => {
      Files.forEach(File => {
        this.FilesNames.push(File.name)
      })
    })
  }
  ConfigureShippingDocsForUserControl() {
    if (this.POHasShippingDocsFile) {
      this.spinner.WrapWithSpinner((async () => {
        let ShippingDocs = await this.GetShippingDocs();
        this.DisplayShippingDocs(ShippingDocs);

        this.NewShippingDocs = await this.GetJSZipShippingDocs(ShippingDocs);
        this.ArchivedShippingDocs = await this.GetJSZipShippingDocs(ShippingDocs);
      })(), this.dialogref)
    }
  }
  DeleteFileFromShippingDocs(FileName: string) {
    this.ShippingDocsAreEdited = true
    this.FilesNames.splice(this.FilesNames.indexOf(FileName), 1)
    this.NewShippingDocs.remove(FileName);
  }
  AddFilesToShippingDocs(event: any) {
    this.ShippingDocsAreEdited = true;
    this.AddtitionalShippingDocs = Array.from(event.target.files).forEach((file: any) => {
      this.NewShippingDocs.file(file.name, file)
    })
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

  CheckPoShippingDocsFile() {
    return this.PoToUpdate.shippingDocs != ""
  }

  GetFileExtenstion(file: File) {
    let indexOExtention = file.name.indexOf('.') + 1;
    return file.name.substring(indexOExtention, file.name.length)
  }
  DisplayNotifications(Response: any) {
    if (Response == true) {
      this.Notification.OnSuccess("You Updated the Po successfully")
      this.Close()
    } else {
      this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
    }
    return Response
  }
  NotifyUserOnMissingShippingDocs() {
    let ShippingDocsIsMissing = this.UpdatedPo.get('Status')?.value == "Shipped" && !this.SeletedFile
    if (ShippingDocsIsMissing) {
      this.Notification.OnError("You have to Upload a shipping Document when the status is: Shipped")
    }
    return ShippingDocsIsMissing
  }
  Close() {
    this.dialogref.close();
  }
  CheckForCancelRequests() {
    let StatusOption: Status;
    StatusOption = 'Cancel Request';
    if (this.PoToUpdate.status == StatusOption)
      if (confirm("The Vendor wnats to cancel this Po do you approve?")) {
        StatusOption = 'Canceled';
        this.PoToUpdate.status = StatusOption;
        this.UpdatePo();
      }
  }
  CheckForHoldRequest() {
    let StatusOption: Status;
    StatusOption = 'Hold Request';
    if (this.PoToUpdate.status == StatusOption)
      if (confirm("The Vendor wnats to Hold this Po do you approve?")) {
        StatusOption = 'On Hold';
        this.PoToUpdate.status = StatusOption
        this.UpdatePo();
      }
  }
}
