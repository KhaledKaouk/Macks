import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EPROTONOSUPPORT } from 'constants';
import { NgProgress } from 'ngx-progressbar';
import { Dealers } from 'src/app/Models/Dealers';
import { POs } from 'src/app/Models/Po-model';
import { DealersService } from 'src/app/Services/dealers.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckCorinthianUserPermissions, CheckToken } from 'src/app/Utilities/CheckAuth';
import { ColorTR, RemoveSearchDisclaimer, ShowSearchDisclaimer, Spinner } from 'src/app/Utilities/Common';
import { GetDealerById } from 'src/app/Utilities/DealersHandlers';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { DownLoadFile } from 'src/app/Utilities/FileHandlers';
import { AdjustApprovalStatusForDisplay, FilterPosBy, OrderPosByDate, SetUpPOsForDisplay, SortPosByShipByDate } from 'src/app/Utilities/PoHandlers';
import { DataRowInPage, Directories, Functionalities } from 'src/app/Utilities/Variables';
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
  AllDealers: Dealers[] = [];
  DataRowsInPage: number = DataRowInPage;
  PagesCount: number = 1;
  PageCountArray: number[] = [0];
  DataOfCurrentPage: POs[] = [];
  CurrentPage: number = 0;
  PosForSlicing: POs[] = [];
  UserIsAllowed = CheckCorinthianUserPermissions();

  constructor(private poservice: POsService,
    private DealerService: DealersService,
    private notification: NotificationserService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: Spinner) { }

  ngAfterViewChecked() {
    ColorTR();
  }
  ngOnInit(): void {
    CheckToken(this.router);
    this.GetAllDealers();
    this.GetPos();
  }

  GetPos() {
    this.spinner.WrapWithSpinner(this.poservice.GetPos().then((pos: any) => {
      this.mydata = SetUpPOsForDisplay(pos);
      this.PagesCount = Math.ceil(this.mydata.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0);
    }, err => Auth_error_handling(err, this.notification, this.router)))
  }
  GetAllDealers(){
    this.spinner.WrapWithSpinner(this.DealerService.GetAllDealers().then((Dealers: any) => {
      this.AllDealers = Dealers;
    }))
  }
  DisplayDealerName(DealerId: string){
    return GetDealerById(this.AllDealers,DealerId).name
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
    return AdjustApprovalStatusForDisplay(approvalStatus);
  }
  SearchPos(event: any) {
    this.SliceDataForPaginantion(0, FilterPosBy(this.mydata,this.AllDealers, event.target.value))
  }
  OrderPosByShipByDate(){
    SortPosByShipByDate(this.PosForSlicing)
    this.SliceDataForPaginantion(0,this.PosForSlicing)
  }
  ShowDealerProfile(dealer_Id: string){
    this.router.navigate(['/DealerProfile', dealer_Id])
  }

}
