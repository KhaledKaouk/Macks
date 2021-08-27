import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { AdjustingDataForDisplay, ColorTR, DeleteTestingPos, FilterPosBy, Functionalities, Spinner, StaticData } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { AdminReviewComponent } from '../admin-review/admin-review.component';
import { PoDetailsComponent } from '../po-details/po-details.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  mydata: POs[] = []
  PageCountArray: number[] = [0];
  PagesCount: number = 1;
  DataRowsInPage: number = 15;
  DataOfCurrentPage: POs[] = [];
  CurrentPage: number = 0;


  constructor(
    private poservice: POsService,
    private dialog: MatDialog,
    private router: Router,
    private notification: NotificationserService,
    private spinner: Spinner
  ) {
  }
  
  ngAfterViewChecked() {
    ColorTR();
  }
  ngOnInit(): void {

    CheckToken(this.router);

    this.spinner.WrapWithSpinner( this.poservice.GetPos().then((res: any) => {
      this.mydata = res;
      this.mydata = this.mydata.filter(PO => PO.deleted != true)
      this.mydata.reverse();
      this.PagesCount = Math.ceil(this.mydata.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0);
    }, (err: any) => {
      Auth_error_handling(err, this.notification, this.router)
      
    }))
  }
  VeiwDetails(P: POs) {
    let dialogRef = this.dialog.open(PoDetailsComponent, {
      height: '30rem',
      width: '55rem',
      data: [P,Functionalities.Admin],
    });
  }

  SliceDataForPaginantion(PageNumber: number,Pos?:POs[]) {
    let PosForSlicing: POs[] = this.mydata;
    if(Pos) PosForSlicing = Pos;
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
  AdjustingDataForDisplay(approvalStatus: boolean){
    return AdjustingDataForDisplay(approvalStatus);
  }
  FilterPosByCorinthainPo(event: any){
    this.SliceDataForPaginantion(0,FilterPosBy(this.mydata,event.target.value))
  }

}
