import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { UpdateProductionDatesComponent } from 'src/app/Components/update-production-dates/update-production-dates.component';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { CalculatePageCount, ColorTR, InitPageCountArray, RemoveSearchDisclaimer, ShowSearchDisclaimer, Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { DownLoadFile } from 'src/app/Utilities/FileHandlers';
import { AdjustApprovalStatusForDisplay, FilterPosBy, RemoveDissapprovedPos, SetUpPOsForDisplay, SortPosByShipByDate } from 'src/app/Utilities/PoHandlers';
import { Directories, Functionalities } from 'src/app/Utilities/Variables';
import { PoDetailsComponent } from '../po-details/po-details.component';
@Component({
  selector: 'app-alfemo',
  templateUrl: './alfemo.component.html',
  styleUrls: ['./alfemo.component.css']
})
export class AlfemoComponent implements OnInit {

  AllPos: POs[] = []
  DataRowsInPage: number = 15;
  PagesCount: number = 1;
  PageCountArray: number[] = [0];
  DataOfCurrentPage: POs[] = [];
  CurrentPage: number = 0;
  PosForSlicing: POs[] = [];
  SelectionMode: Boolean = false;
  SelectedPos: POs[] = [];


  constructor(private dialog: MatDialog,
    private poservice: POsService,
    private notification: NotificationserService,
    private router: Router,
    private spinner: Spinner) { }


  ngOnInit(): void {
    CheckToken(this.router);
    this.GetPos();
  }
  ngAfterViewChecked() {
    ColorTR();
  }

  GetPos() {
    this.spinner.WrapWithSpinner(this.poservice.GetPos().then((res: any) => {
      this.AllPos = RemoveDissapprovedPos(SetUpPOsForDisplay(res));
      this.PagesCount = CalculatePageCount(this.AllPos.length, this.DataRowsInPage);
      this.PageCountArray = InitPageCountArray(this.PagesCount)
      this.SliceDataForPaginantion(0);
    }, (err: any) => {
      Auth_error_handling(err, this.notification, this.router)
    }))
  }

  VeiwPoDetails(P: POs) {
    this.dialog.open(PoDetailsComponent, {
      height: '30rem',
      width: '55rem',
      data: [P, Functionalities.Alfemo],
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
    this.SliceDataForPaginantion(0, FilterPosBy(this.AllPos, event.target.value))

  }

  OrderPosByShipByDate() {
    SortPosByShipByDate(this.PosForSlicing)
    this.SliceDataForPaginantion(0, this.PosForSlicing)

  }
  ShowDealerProfile(dealer_Id: number) {
    this.router.navigate(['/DealerProfile', dealer_Id])
  }
  TurnOnSelectionMode() {
    let IndustryIcons = Array.from(document.getElementsByClassName('fa-industry'));
    let Icon = (IndustryIcons as HTMLElement[])[0];
    Icon.style.color = Icon.style.color == 'rgb(3, 160, 98)' ? 'rgb(60, 46, 37)' : 'rgb(3, 160, 98)'
    if (this.SelectionMode && this.SelectedPos.length >= 1) this.ViewProductionDatesForm()
    this.SelectionMode = !this.SelectionMode
  }
  SelectPo(Po: POs,index: number, event: any) {
    let row = event.path[2] as HTMLTableRowElement
    if (this.SelectionMode) if (!this.CheckPoInSelectedPos(Po)) {
      (document.getElementById('CheckPo' + index) as HTMLInputElement).checked = true
      this.SelectedPos.push(Po)
      this.StyleSelectedPo(row);
    } else {
      (document.getElementById('CheckPo'+ index) as HTMLInputElement).checked = false
      this.SelectedPos.splice(this.SelectedPos.indexOf(Po), 1)
      this.RemoveStyleOfUnSelectedPo(row)
    }
  }
  StyleSelectedPo(Tr: HTMLTableRowElement) {
    Tr.style.fontWeight = 'bold'
  }
  RemoveStyleOfUnSelectedPo(Tr: HTMLTableRowElement) {
    Tr.style.fontWeight = 'normal'
  }
  CheckPoInSelectedPos(Po: POs) {
    return this.SelectedPos.includes(Po)
  }
  ViewProductionDatesForm() {
    this.dialog.open(UpdateProductionDatesComponent, {
      height: '30rem',
      width: '30rem'
    }).afterClosed().toPromise().then((data) => {
      if (data) {
        this.SetPoStatusAndProductionDates(data.Dates as FormGroup)
        this.UpdatePos()
      } else {
        this.TurnOnSelectionMode();
      }

    })
  }
  SetPoStatusAndProductionDates(Dates: FormGroup) {
    this.SelectedPos.forEach(Po => {
      Po.productionStartDate = Dates.get('ProductionStartDate')?.value
      Po.productionFinishDate = Dates.get('ProductionFinishDate')?.value
      Po.status = "In Production"
    })
  }
  UpdatePos() {
    this.spinner.WrapWithSpinner(this.poservice.UpdatePosBulk(this.SelectedPos)
      .toPromise()
      .then((res: any) => {
        this.notification.OnSuccess('You have Updated the Pos Successfully')
        location.reload()
      }))
  }

}
