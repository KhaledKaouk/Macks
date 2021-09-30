import { DatePipe } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { resolve } from 'dns';
import * as JSZip from 'jszip';
import { files } from 'jszip';
import { NgProgress } from 'ngx-progressbar';
import { zip } from 'rxjs';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { AddPreffixAndExtention, RemoveSlashes, Spinner, UploadFile } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
@Component({
  selector: 'app-alfemo-update',
  templateUrl: './alfemo-update.component.html',
  styleUrls: ['./alfemo-update.component.css']
})
export class AlfemoUpdateComponent implements OnInit {

  UpdatedPo = new FormGroup({
    Status: new FormControl(''),
    ContainerNumber: new FormControl(''),
    FinalDestination: new FormControl(''),
    FactoryEstimatedArrivalDate: new FormControl(''),
    FactoryEstimatedShipDate: new FormControl(''),
    AlfemoComents: new FormControl('')
  })

  FileSaver = require('file-saver');

  PoToUpdate: POs = new POs();
  ShippingDocsAreEdited: boolean = false;
  SeletedFile: any;
  ArchivedFiles: any;
  AddtitionalShippingDocs: any;
  NewShippingDocs = new JSZip();
  ArchivedShippingDocs = new JSZip();
  FilesNames: string[] = [];

  constructor(private PoService: POsService,
    private Notification: NotificationserService,
    private dialogref: MatDialogRef<AlfemoUpdateComponent>,
    private router: Router,
    private spinner: Spinner,
    @Inject(MAT_DIALOG_DATA) public data: POs) { }

  ngOnInit(): void {
    CheckToken(this.router);
    console.log(this.ReplaceBackSlashInDate(this.GetCurrentDate()))
    console.log(this.GetCurrentDate())
    this.PoToUpdate = this.data;
    this.AssignPoDataToForm();
    if (this.PoToUpdate.shippingDocs != "") this.GetShippingDocs()
  }



  AssignPoDataToForm() {
    this.UpdatedPo.setValue({
      Status: this.data.status,
      ContainerNumber: this.data.containerNumber,
      FinalDestination: this.data.finalDestLocation,
      FactoryEstimatedArrivalDate: new DatePipe('en-US').transform(this.data.factoryEstimatedArrivalDate, 'YYYY-MM-dd'),
      FactoryEstimatedShipDate: new DatePipe('en-US').transform(this.data.factoryEstimatedShipDate, 'YYYY-MM-dd'),
      AlfemoComents: this.data.alfemoComments
    })
  }


  async Submit() {
    this.AssignformValuesToObject();
    if (this.ShippingDocsAreEdited) {
      await this.NewShippingDocs.generateAsync({ type: 'blob' }).then(content => {
        this.SeletedFile = content
      })
      await this.ArchivedShippingDocs.generateAsync({ type: 'blob' }).then(content => {
        this.ArchivedFiles = content
      })
    }
    if (this.SeletedFile) {
      if (!this.ShippingDocsAreEdited) await this.CombineFilesInZip();
      console.log(this.SeletedFile)
      console.log(this.ArchivedFiles)
      let UploadProcess: any;
      (async () => {
        UploadProcess = await UploadFile(
          this.PoService,
          this.ConstructFormDataFile(this.SeletedFile),
          this.ConstructFileName(),
          this.Notification,
          this.spinner,
          this.router,
          this.dialogref)

        let UploadArchiveProccess = await UploadFile(this.PoService,
          this.ConstructArchivedFormData(this.ArchivedFiles),
          this.ConstructArchiveFileName(),
          this.Notification,
          this.spinner,
          this.router,
          this.dialogref)

        if (UploadProcess == true) {
          this.UpdatePo();
        }
      })();
    } else {
      this.UpdatePo();
    }
  }
  UpdatePo() {

    if (this.UpdatedPo.get('Status')?.value == "Shipped" && !this.SeletedFile) {
      this.Notification.OnError("You have to Upload a shipping Document when the status is: Shipped")
    } else {
      this.spinner.WrapWithSpinner(this.PoService.UpdatePo(this.PoToUpdate).toPromise().then((res: any) => {
        if (res == true) {
          this.Notification.OnSuccess("You Updated the Po successfully")
          this.Close()
        } else {
          this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
        }
      }, (err: any) => {
        Auth_error_handling(err, this.Notification, this.router)
      }), this.dialogref)
    }
  }

  ConstructFileName() {
    let FileName = RemoveSlashes(this.PoToUpdate.dealerPONumber) + "_" + RemoveSlashes(this.PoToUpdate.corinthianPO);
    FileName = AddPreffixAndExtention("SD_", FileName, 's.zip')

    return FileName
  }
  ConstructArchiveFileName() {
    let FileName = RemoveSlashes(this.PoToUpdate.dealerPONumber) + "_" + RemoveSlashes(this.PoToUpdate.corinthianPO);
    FileName = AddPreffixAndExtention("Archive_" + this.ReplaceBackSlashInDate(this.GetCurrentDate()) + "_", FileName, 'Example.zip')

    return FileName
  }
  ConstructArchivedFormData(Files: any) {
    let fd = new FormData();
    fd.append('PO', Files, this.ConstructArchiveFileName());
    return fd;
  }
  ConstructFormDataFile(Files: any) {
    let fd = new FormData();
    this.PoToUpdate.shippingDocs = this.ConstructFileName();
    fd.append('PO', Files, this.ConstructFileName());
    return fd;
  }
  SaveFileInObject(event: any) {
    this.SeletedFile = event.target.files;
  }

  Close() {
    this.dialogref.close();
  }
  AssignformValuesToObject() {
    this.PoToUpdate.status = this.UpdatedPo.get('Status')?.value;
    this.PoToUpdate.containerNumber = this.UpdatedPo.get('ContainerNumber')?.value;
    this.PoToUpdate.finalDestLocation = this.UpdatedPo.get('FinalDestination')?.value;
    this.PoToUpdate.factoryEstimatedArrivalDate = this.UpdatedPo.get('FactoryEstimatedArrivalDate')?.value;
    this.PoToUpdate.factoryEstimatedShipDate = this.UpdatedPo.get('FactoryEstimatedShipDate')?.value;
    this.PoToUpdate.alfemoComments = this.UpdatedPo.get('AlfemoComents')?.value;
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


  async CombineFilesInZip() {
    let zip = new JSZip();
    Array.from(this.SeletedFile).forEach((File: any) => {
      zip.file(File.name, File)
    })
    await zip.generateAsync({ type: "blob" }).then((content) => {
      this.SeletedFile = content;
    });
  }


  async GetShippingDocs() {
    let ShippingDocs: File;
    let localApi = 'http://localhost:5000/Assets/';
    let realapi = 'https://macksdistribution.com/Attatchments/SD/'
    return ShippingDocs = await fetch(realapi + this.PoToUpdate.shippingDocs).then((res: any) => {
      this.spinner.WrapWithSpinner(res.clone().blob().then(async (res1: any) => {
        let file = res1;
        file.name = this.PoToUpdate.shippingDocs;
        file.lastModifiedDate = new Date();

        this.DisplayShippingDocs(file);

        this.NewShippingDocs = await this.GetNewShippingDocsCopy(file);
        this.ArchivedShippingDocs = await this.GetNewShippingDocsCopy(file);
      }), this.dialogref)
      return res.clone().blob()
    })
  }
  DeleteFile(FileName: string) {
    this.ShippingDocsAreEdited = true
    this.FilesNames.splice(this.FilesNames.indexOf(FileName), 1)
    this.NewShippingDocs.remove(FileName);
  }
  async UnzipShippingDocs(file: File) {
    let zip = new JSZip();

    let ShippingDocs: any[] = [];
    await zip.loadAsync(file).then(async (content: JSZip) => {

      for (let filename of Object.keys(content.files)) {

        await zip.file(filename)?.async('blob').then((content) => {
          ShippingDocs.push(new File([content], filename))
        })
      }
    })
    return ShippingDocs as File[]
  }
  async ArchiveOldShippingDocs(OldShippingDocs: File) {
    let FinalShippingDocs = new JSZip();
    let CopOfShippingDocs = new JSZip();

    let OldDocs = await this.UnzipShippingDocs(OldShippingDocs)

    OldDocs.forEach(file => {
      if (this.GetFileExtenstion(file) != 'zip') {
        FinalShippingDocs.file(file.name, file)
        CopOfShippingDocs.file(file.name, file)
      } else {
        FinalShippingDocs.file(file.name, file)
      }
    })

    await CopOfShippingDocs.generateAsync({ type: 'blob' }).then((content) => {
      FinalShippingDocs.file('Archived' + this.ReplaceBackSlashInDate(this.GetCurrentDate()) + '.zip', content)
    })

    return FinalShippingDocs
  }
  async GetNewShippingDocsCopy(OldShippingDocs: File) {
    let CopyOfShippingDocs = new JSZip();
    let OldDocs = await this.UnzipShippingDocs(OldShippingDocs)

    OldDocs.forEach(file => {
      if (this.GetFileExtenstion(file) != 'zip') {
        CopyOfShippingDocs.file(file.name, file)
      }
    })
    return CopyOfShippingDocs

  }
  // DeleteFileFromZip(ShippingDocs: JSZip, FileName: string) {
  //   let ModefiedShippingDocs = ShippingDocs;
  //   return ModefiedShippingDocs.remove(FileName)
  // }
  // AddFileToZip(ShippingDocs: JSZip, File: File) {
  //   let ModefiedShippingDocs = ShippingDocs;
  //   return ModefiedShippingDocs.file(File.name, File)
  // }

  GetFileExtenstion(file: File) {
    let indexOExtention = file.name.indexOf('.') + 1;
    return file.name.substring(indexOExtention, file.name.length)
  }
  ReplaceBackSlashInDate(Date: string) {
    return Date.replace(/\\|\//g, "_")
  }
  GetCurrentDate() {
    let Now = new Date().toLocaleString().replace(",", "_").replace(":","").replace(":","");
    return Now.replace(/ /g,"")
  }

  AddFilesToShippingDocs(event: any) {
    this.ShippingDocsAreEdited = true;
    this.AddtitionalShippingDocs = Array.from(event.target.files).forEach((file: any) => {
      this.NewShippingDocs.file(file.name, file)
    })
  }
  DisplayShippingDocs(file: File) {
    this.UnzipShippingDocs(file).then(Files => {
      Files.forEach(File => {
        if (this.GetFileExtenstion(File) != "zip") {
          this.FilesNames.push(File.name)
        }
      })
    })
  }
}
