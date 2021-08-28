import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { AdjustingDataForDisplay, ColorTR, Directories, DownLoadFile, FilterPosBy, Functionalities, Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
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
      this.AllPos = res;
      this.AllPos = this.AllPos.filter(PO => PO.deleted != true)
      this.AllPos.reverse();
      this.AllPos = this.AllPos.filter(E => E.approvalStatus == true)
      this.PagesCount = Math.ceil(this.AllPos.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0);
    }, (err: any) => {
      Auth_error_handling(err, this.notification, this.router)
    }))
  }

  DownloadMackPo(Index: number) {
    let FileName = this.DataOfCurrentPage[Index].mackPOAttach;
    DownLoadFile(Directories.MackPo, FileName)
  }
  VeiwPoDetails(P: POs) {
    this.dialog.open(PoDetailsComponent, {
      height: '30rem',
      width: '55rem',
      data: [P, Functionalities.Alfemo],
    });
  }


  SliceDataForPaginantion(PageNumber: number, SearchedPos?: POs[]) {
    let PosForSlicing: POs[] = this.AllPos;
    if (SearchedPos) PosForSlicing = SearchedPos;
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if (PosForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage).length >= 1) {
      this.DataOfCurrentPage = PosForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage)
      this.CurrentPage = PageNumber;
    }
  }
  NextPage() {
    this.SliceDataForPaginantion(this.CurrentPage + 1)
  }
  PreviousPage() {
    this.SliceDataForPaginantion(this.CurrentPage - 1)
  }


  AdjustApprovalStatusForDisplay(approvalStatus: boolean) {
    return AdjustingDataForDisplay(approvalStatus);
  }
  SearchPosByCorinthainPo(event: any) {
    this.SliceDataForPaginantion(0, FilterPosBy(this.AllPos, event.target.value))
  }
}
