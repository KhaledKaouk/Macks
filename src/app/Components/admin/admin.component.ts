import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { PoDetailsComponent } from '../po-details/po-details.component';
import { CalculatePageCount, ColorTR, InitPageCountArray, RemoveSearchDisclaimer, ShowSearchDisclaimer, Spinner } from 'src/app/Utilities/Common';
import { DataRowInPage, Functionalities } from 'src/app/Utilities/Variables';
import { AdjustApprovalStatusForDisplay, FilterPosBy, SetUpPOsForDisplay, SortPosByShipByDate } from 'src/app/Utilities/PoHandlers';
import { ExportPosToXLSX } from 'src/app/Utilities/ReportsHandlers';
import { DealersService } from 'src/app/Services/dealers.service';
import { Dealers } from 'src/app/Models/Dealers';
import { GetDealerById } from 'src/app/Utilities/DealersHandlers';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  AllPos: POs[] = []
  AllDealers: Dealers[] = [];
  PageCountArray: number[] = [0];
  PagesCount: number = 1;
  DataRowsInPage: number = DataRowInPage;
  DataOfCurrentPage: POs[] = [];
  CurrentPage: number = 0;
  PosForSlicing: POs[] = [];
  PoUnderControl: POs = new POs();
  InvoicePOs: POs[] = [];

  constructor(
    private poservice: POsService,
    private dealerService: DealersService,
    private dialog: MatDialog,
    private router: Router,
    private notification: NotificationserService,
    private spinner: Spinner
  ) {
  }


  ngOnInit(): void {
    CheckToken(this.router);
    this.GetAllDealers();
    this.GetAllPos();
  }
  ngAfterViewChecked() {
    ColorTR();
  }


  GetAllPos() {
    this.spinner.WrapWithSpinner(this.poservice.GetPos().then((res: any) => {
      this.AllPos = SetUpPOsForDisplay(res)
      this.PagesCount = CalculatePageCount(this.AllPos.length, this.DataRowsInPage);
      this.PageCountArray = InitPageCountArray(this.PagesCount)
      this.SliceDataForPaginantion(0);

    }, (err: any) => {
      Auth_error_handling(err, this.notification, this.router)

    }))
  }

  GetAllDealers() {
    this.spinner.WrapWithSpinner(this.dealerService.GetAllDealers().then((Dealers: any) => {
      this.AllDealers = Dealers
    }))
  }
  DisplayDealerName(dealerId: string) {
    return GetDealerById(this.AllDealers, dealerId).name
  }
  VeiwPoDetails(P: POs) {
    let dialogRef = this.dialog.open(PoDetailsComponent, {
      height: '30rem',
      width: '55rem',
      data: [P, Functionalities.Admin],
    });
  }


  SliceDataForPaginantion(PageNumber: number, SearchedPos?: POs[]) {
    this.PosForSlicing = this.AllPos;
    if (SearchedPos) this.PosForSlicing = SearchedPos;
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if (this.PosForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage).length >= 1) {
      RemoveSearchDisclaimer();
      this.DataOfCurrentPage = this.PosForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage)
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


  AdjustApprovalStatusForDisplay(approvalStatus: boolean) {
    return AdjustApprovalStatusForDisplay(approvalStatus);
  }
  SearchPos(event: any) {
    this.SliceDataForPaginantion(0, FilterPosBy(this.AllPos, this.AllDealers, event.target.value))
  }
  ExportPosToExcel() {
    ExportPosToXLSX(this.AllPos)
  }
  OrderPosByShipByDate() {
    SortPosByShipByDate(this.PosForSlicing)
    this.SliceDataForPaginantion(0, this.PosForSlicing)
  }
  ShowDealerProfile(dealer_Id: string) {
    this.router.navigate(['/DealerProfile', dealer_Id])
  }
  ViewInvoiceForm() {
    this.router.navigate(['/Invoice'], { queryParams: { IP: this.GetCorinthianPoFileNames(), Port: this.InvoicePOs[0].port, PosIds: this.GetPoIds() } })
  }
  GetPoIds() {
    let PoIds: string[] = [];
    this.InvoicePOs.forEach(Po => PoIds.push(Po._id))

    return PoIds;
  }
  GetCorinthianPoFileNames() {
    let PoFileNames: string[] = []
    this.InvoicePOs.forEach(Po => PoFileNames.push(Po.corinthianPOAttach))
    return PoFileNames
  }
  AddPoToInvoice(Po: POs) {
    if (!this.CheckPoInInvoice(Po) && this.CheckPortOfPo(Po)) {
      this.InvoicePOs.push(Po)
      this.notification.DisplayInfo('You have added Po of: ' + Po.dealerPONumber + ' to the invoice')
    } else {
      this.notification.OnError('you have added this Po or the port of the Po doesnot match')
    }
  }
  CheckPortOfPo(Po: POs) {
    return this.InvoicePOs.length == 0 || this.InvoicePOs[0].port == Po.port
  }
  CheckPoInInvoice(Po: POs) {
    return this.InvoicePOs.includes(Po)
  }
  removePoFromInvoice(Po: POs) {
    this.InvoicePOs.splice(this.InvoicePOs.indexOf(Po), 1)
  }
  ArchivePo(Po: POs) {
    Po.Archived = true;
    this.spinner.WrapWithSpinner(this.poservice.UpdatePo(Po).toPromise().then(
      res => this.notification.OnSuccess('Po has been archived'),
      err => Auth_error_handling(err, this.notification, this.router)
    ))
  }
  UnArchivePo(Po: POs) {
    Po.Archived = false;
    this.spinner.WrapWithSpinner(this.poservice.UpdatePo(Po).toPromise().then(
      res => this.notification.OnSuccess('Po has been Unarchived'),
      err => Auth_error_handling(err, this.notification, this.router)
    ))
  }
  ShowTableSettings() {
    let SettingsSectionHtmlElement = document.getElementById('SecondSection')
    if (SettingsSectionHtmlElement) SettingsSectionHtmlElement.style.opacity = SettingsSectionHtmlElement.style.opacity == "1" ? "0" : "1"
  }
  ChangeRowPerPage(event: any) {
    this.DataRowsInPage = parseInt(event.target.value)
  }
  ChangePageSettings() {
    if (this.DataRowsInPage >= 5 && this.DataRowsInPage <= 50) {
      localStorage.setItem('DataRowInPage', this.DataRowsInPage.toString())
      location.reload()
    } else {
      this.notification.OnError('The Number Should be between 5 and 50')
    }
  }
}
