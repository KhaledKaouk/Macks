import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { PoDetailsComponent } from '../po-details/po-details.component';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { CalculatePageCount, ColorTR, InitPageCountArray, RemoveSearchDisclaimer, ShowSearchDisclaimer, Spinner } from 'src/app/Utilities/Common';
import { Functionalities } from 'src/app/Utilities/Variables';
import { AdjustApprovalStatusForDisplay, FilterPosBy, RemoveDeletedPOs, SetUpPOsForDisplay, SortPosByShipByDate } from 'src/app/Utilities/PoHandlers';
import { ExportPosToXLSX } from 'src/app/Utilities/ReportsHandlers';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  AllPos: POs[] = []
  PageCountArray: number[] = [0];
  PagesCount: number = 1;
  DataRowsInPage: number = 15;
  DataOfCurrentPage: POs[] = [];
  CurrentPage: number = 0;
  PosForSlicing: POs[] = [];

  constructor(
    private poservice: POsService,
    private dialog: MatDialog,
    private router: Router,
    private notification: NotificationserService,
    private spinner: Spinner
  ) {
  }
  

  ngOnInit(): void {

    CheckToken(this.router);
    this.GetAllPos();
    
  }
  ngAfterViewChecked() {
    ColorTR();
  }

  GetAllPos(){
    this.spinner.WrapWithSpinner( this.poservice.GetPos().then((res: any) => {
      this.AllPos = SetUpPOsForDisplay(res)
      this.PagesCount = CalculatePageCount(this.AllPos.length,this.DataRowsInPage);
      this.PageCountArray = InitPageCountArray(this.PagesCount)
      this.SliceDataForPaginantion(0);
      
    }, (err: any) => {
      Auth_error_handling(err, this.notification, this.router)
      
    }))
  }


  VeiwPoDetails(P: POs) {
    let dialogRef = this.dialog.open(PoDetailsComponent, {
      height: '30rem',
      width: '55rem',
      data: [P,Functionalities.Admin],
    });
  }


  SliceDataForPaginantion(PageNumber: number,SearchedPos?:POs[]) {
     this.PosForSlicing = this.AllPos;
    if(SearchedPos) this.PosForSlicing = SearchedPos;
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if (this.PosForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage).length >= 1) {
      RemoveSearchDisclaimer();
      this.DataOfCurrentPage = this.PosForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage)
      this.CurrentPage = PageNumber;
    }else{
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

  
  AdjustApprovalStatusForDisplay(approvalStatus: boolean){
    return AdjustApprovalStatusForDisplay(approvalStatus);
  }
  SearchPos(event: any){
    this.SliceDataForPaginantion(0,FilterPosBy(this.AllPos,event.target.value))
  }
  ExportPosToExcel(){
    ExportPosToXLSX(this.AllPos)
  }
  OrderPosByShipByDate(){
    SortPosByShipByDate(this.PosForSlicing)
    this.SliceDataForPaginantion(0,this.PosForSlicing)
  }
  ShowDealerProfile(dealer_Id: number){
    this.router.navigate(['/DealerProfile', dealer_Id])
  }
}
