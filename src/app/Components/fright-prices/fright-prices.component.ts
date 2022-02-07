import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { freightPrices } from 'src/app/Models/frightPrices';
import { FrightpricesService } from 'src/app/Services/frightprices.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { CalculatePageCount, CapitlizeFirstLater, InitPageCountArray, RemoveSearchDisclaimer, ShowSearchDisclaimer, Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { FrightPriceUpdateComponent } from '../fright-price-update/fright-price-update.component';
import * as XLSX from 'xlsx';
import { GetFileExtenstion } from 'src/app/Utilities/ZipHandlers';
import { DataRowInPage } from 'src/app/Utilities/Variables';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FilterFreightByPort } from 'src/app/Utilities/FreightsHandlers';

@Component({
  selector: 'app-fright-prices',
  templateUrl: './fright-prices.component.html',
  styleUrls: ['./fright-prices.component.sass']
})
export class FrightPricesComponent implements OnInit {

  FrightPricesList: freightPrices[] = [];
  FreightsForSlicing: freightPrices[] = [];
  SelectedFile: any;
  PageCountArray: number[] = [0];
  PagesCount: number = 1;
  DataRowsInPage: number = DataRowInPage;
  DataOfCurrentPage: freightPrices[] = [];
  CurrentPage: number = 0;
  Carrier: string = "";
  Freight = new FormGroup({
    Carrier: new FormControl('',Validators.required)
  })

  constructor(private FirghtpricesSer: FrightpricesService,
    private notification: NotificationserService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: Spinner,
  ) { }

  ngOnInit(): void {
    CheckToken(this.router)
    this.GetFrightPrices();
  }
  UpdateSinglePrice(FrightPriceToUpdate: freightPrices) {
    this.dialog.open(FrightPriceUpdateComponent, {
      height: '30rem',
      width: '40rem',
      data: FrightPriceToUpdate
    })
  }

  GetFrightPrices() {
    this.spinner.WrapWithSpinner(this.FirghtpricesSer.GetAllFrightPrices().then((freightPrices: any) => {
      this.FrightPricesList = freightPrices;
      this.SetFreightPricesForDisplay();
      this.PagesCount = CalculatePageCount(this.FrightPricesList.length, this.DataRowsInPage);
      this.PageCountArray = InitPageCountArray(this.PagesCount)
      this.SliceDataForPaginantion(0);
    }, (err: any) => {
      Auth_error_handling(err, this.notification, this.router)
    }))
  }

  SetFreightPricesForDisplay() {
    this.FrightPricesList.forEach(FrightPrice => this.CapitlizeLocationFirstLater(FrightPrice))
  }
  CapitlizeLocationFirstLater(FreightPrice: freightPrices) {
    FreightPrice.City = CapitlizeFirstLater(FreightPrice.City)
  }

  CheckRole() {
    return (localStorage.getItem('Role') == "admin" || localStorage.getItem('Role') == "alfemo") ? true : false;
  }
  OpenFileBrowser() {
    document.getElementById('file')?.click();
  }
  async SelectFile(event: any) {
    this.SelectedFile = event.target.files[0]
    this.UpdateFreights();
  }
  async UpdateFreights() {
    if (await this.ValidateUploadedFile()) {
      if (confirm('Are you sure you want to update Frieght Prices')) {
        this.FirghtpricesSer.UpdateFrightPricesByBulk((await this.GetFreightsFromFile()))
          .then(
            res => {
              this.notification.OnSuccess('Freights Updated')
              location.reload();
            },
            err => Auth_error_handling(err, this.notification, this.router)
          )

      }
    } else {
      this.notification.OnError('File is either not excel or not in the right format')
    }
  }
  async ValidateUploadedFile() {
    return GetFileExtenstion(this.SelectedFile) == 'xlsx' && (await this.GetFreightsFromFile()).length >= 1
  }
  async GetFreightsFromFile() {
    let WorkSheet = await this.GetWorkSheet(this.SelectedFile)
    let Freights: freightPrices[] = []

    WorkSheet = this.AdjustSheetDateCellValueasFormated(WorkSheet)

    let Freightssheet = XLSX.utils.sheet_to_json(WorkSheet) as JSON[]

    for (let Freight of Freightssheet) {
      let FrieghtPrice: freightPrices = new freightPrices();

      FrieghtPrice.Port = this.GetValue(Freight, 'Port of Discharge')
      FrieghtPrice.City = this.GetValue(Freight, 'City')
      FrieghtPrice.State = this.GetValue(Freight, 'State')
      FrieghtPrice.ZipCode = this.GetValue(Freight, 'Zip Code')
      FrieghtPrice.Validty = this.GetValue(Freight, 'VALIDTY')
      FrieghtPrice.PortToPortPrice = parseInt((this.GetValue(Freight, "Port-to-Port Seafreight (40'HC)")).replace(/^\D+/g, ''))
      FrieghtPrice.TruckDeliveryPrice = parseInt((this.FindTrucDeliveryPrice(Freight) as string).replace(/^\D+/g, ''))
      FrieghtPrice.RailDeliveryPrice = parseInt((this.FindRailDeliveryPrice(Freight) as string).replace(/^\D+/g, ''))
      FrieghtPrice.RailRamp = this.GetValue(Freight, "Closest Rail Ramp (If applicable)")
      FrieghtPrice.Carrier = this.Carrier;

      if (Object.keys(Freight).length >= 4 && FrieghtPrice.Port != '0') Freights.push(FrieghtPrice)
    }
    return Freights
  }
  AdjustSheetDateCellValueasFormated(WorkSheet: XLSX.WorkSheet) {
    let PortRowindex: number = 1;
    let LastPortRowIndex = parseInt((WorkSheet['!ref'] as string).slice(4, 6).replace(/^\D+/g, '') || '0')

    while (PortRowindex <= LastPortRowIndex) {
      if (WorkSheet['K' + PortRowindex]) WorkSheet['K' + PortRowindex].v = WorkSheet['K' + PortRowindex].w;
      PortRowindex++;
    }
    return WorkSheet

  }
  DontKnowFunction(Freight: Object, FreightPrice: freightPrices) {
    if ((this.GetValue(Freight, 'Type of Transportation') as string).toLowerCase().includes('truck')) {
      FreightPrice.TruckDeliveryPrice = this.GetValue(Freight, "Door Delivery Rate (40'HC)")
    }
    if ((this.GetValue(Freight, 'Type of Transportation') as string).toLowerCase().includes('rail')) {
      FreightPrice.RailDeliveryPrice = this.GetValue(Freight, "Door Delivery Rate (40'HC)")
    }
    return FreightPrice
  }
  FindRailDeliveryPrice(Freight: Object) {
    return this.GetValue(Freight, "Rail Ramp Rate (40'HC)") != '0' ? this.GetValue(Freight, "Rail Ramp Rate (40'HC)") : this.GetValue(Freight, "RAIL + TRUCK")
  }
  FindTrucDeliveryPrice(Freight: Object) {
    return this.GetValue(Freight, "Door Delivery Rate (40'HC)") != '0' ? this.GetValue(Freight, "Door Delivery Rate (40'HC)") : this.GetValue(Freight, "RAIL + TRUCK")

  }
  CheckFieldValue(Freight: Object, key: string) {
    return Object.keys(Freight).indexOf(key) >= 0
  }
  GetValueIndex(Freight: Object, key: string) {
    return Object.keys(Freight).indexOf(key)
  }
  GetValue(Freight: Object, key: string) {
    return this.CheckFieldValue(Freight, key) ? Object.values(Freight)[this.GetValueIndex(Freight, key)] : "0"
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
  SliceDataForPaginantion(PageNumber: number, SearchedFreights?: freightPrices[]) {
    this.FreightsForSlicing = this.FrightPricesList
    if (SearchedFreights) this.FreightsForSlicing = SearchedFreights;
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if (this.FreightsForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage).length >= 1) {
      RemoveSearchDisclaimer();
      this.DataOfCurrentPage = this.FreightsForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage)
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
  SearchFreights(event: any){
    this.SliceDataForPaginantion(0, FilterFreightByPort(this.FrightPricesList, event.target.value))
  }
  SetUpCarrierName(event: any){
    this.Carrier = event.target.value;
  }
}
