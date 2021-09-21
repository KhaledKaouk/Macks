import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { AdjustingDataForDisplay, CheckCorinthianUserPermissions, ColorTR, DeleteTestingPos, Directories, DownLoadFile, FilterPosBy, Functionalities, OrderPosByDate, RemoveSearchDisclaimer, ShowSearchDisclaimer, Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { CorinthianUpdateComponent } from '../corinthian-update/corinthian-update.component';
import { NewPoComponent } from '../new-po/new-po.component';
import { PoDetailsComponent } from '../po-details/po-details.component';

@Component({
  selector: 'app-my-pos',
  templateUrl: './my-pos.component.html',
  styleUrls: ['./my-pos.component.sass']
})
export class MyPosComponent implements OnInit {



  mydata: POs[] = [];

  DataRowsInPage: number = 15;
  PagesCount: number = 1;
  PageCountArray: number[] = [0];
  DataOfCurrentPage: POs[] = [];
  CurrentPage: number = 0;
  PosForSlicing: POs[] = [];
  UserIsAllowed = CheckCorinthianUserPermissions();

  constructor(private poservice: POsService,
    private notification: NotificationserService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: Spinner) { }

  ngAfterViewChecked() {
    ColorTR();
  }
  ngOnInit(): void {
    CheckToken(this.router);
    this.GetPos();
  }

  GetPos() {
    this.spinner.WrapWithSpinner(this.poservice.GetPos().then((res: any) => {
      this.mydata = res;
      this.mydata = this.mydata.filter(PO => PO.deleted != true)
      this.mydata = OrderPosByDate(this.mydata);
      this.PagesCount = Math.ceil(this.mydata.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0);
    }, (err: any) => {
      Auth_error_handling(err, this.notification, this.router)
    }))
  }
  OpenEditPoForm(P: POs) {
    this.dialog.open(CorinthianUpdateComponent, {
      height: '60rem',
      width: '55rem',
      data: P
    })
  }
  ViewPoDetails(P: POs) {
    this.dialog.open(PoDetailsComponent, {
      height: '30rem',
      width: '55rem',
      data: [P, Functionalities.Corinthain],
    });
  }

  
  SliceDataForPaginantion(PageNumber: number, Pos?: POs[]) {
    this.PosForSlicing= this.mydata;
    if (Pos) this.PosForSlicing = Pos;
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


  DownloadShippingDocs(Po: POs) {
    let FileName = Po.shippingDocs;
    DownLoadFile(Directories.ShippingDocument, FileName);
  }
  DownLoadCorinthainPo(Po: POs) {
    let FileName = Po.corinthianPOAttach
    DownLoadFile(Directories.CorinthainPo, FileName);
  }


  AdjustApprovalStatusForDisplay(approvalStatus: boolean) {
    return AdjustingDataForDisplay(approvalStatus);
  }
  SearchPos(event: any) {
    this.SliceDataForPaginantion(0, FilterPosBy(this.mydata, event.target.value))
  }
  OrderPosByShipByDate(){
    this.PosForSlicing.sort((a, b) => {
      if ((new DatePipe('en-US').transform(a.shipBy,'YYYY-MM-dd') || "") > (new DatePipe('en-US').transform(b.shipBy,'YYYY-MM-dd') || "")) return +1
      if ((new DatePipe('en-US').transform(a.shipBy,'YYYY-MM-dd') || "") < (new DatePipe('en-US').transform(b.shipBy,'YYYY-MM-dd') || "")) return -1
      return 0
    });
    this.SliceDataForPaginantion(0,this.PosForSlicing)
  }
  ShowDealerProfile(dealer_Id: number){
    this.router.navigate(['/DealerProfile', dealer_Id])
  }

}
