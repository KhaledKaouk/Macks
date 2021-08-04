import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { AdjustingDataForDisplay, Directories, DownLoadFile, Functionalities, OrderPosByDate, StaticData } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { PoDetailsComponent } from '../po-details/po-details.component';

@Component({
  selector: 'app-my-pos',
  templateUrl: './my-pos.component.html',
  styleUrls: ['./my-pos.component.sass']
})
export class MyPosComponent implements OnInit {


 
  mydata: POs[] =[];
  
  DataRowsInPage: number = 15;
  PagesCount: number = 1;
  PageCountArray: number[] = [0];
  DataOfCurrentPage: POs[] = [];
  CurrentPage: number = 0;

  progressRef: any;

  constructor(private poservice: POsService,
    private progress:NgProgress,
    private notification: NotificationserService,
    private router: Router,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    CheckToken(this.router);
      this.progressRef = this.progress.ref('myProgress');
      this.progressRef.start();
      this.GetPos();
      /* this.mydata = StaticData
      this.mydata.reverse();
      this.PagesCount = Math.ceil(this.mydata.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0); */
  }

  SliceDataForPaginantion(PageNumber: number){
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if(this.mydata.slice(SliceBegining,SliceBegining + this.DataRowsInPage).length >=1){
      this.DataOfCurrentPage = this.mydata.slice(SliceBegining,SliceBegining + this.DataRowsInPage)
      this.CurrentPage = PageNumber;
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
    DownLoadFile(Directories.ShippingDocument,FileName);
  }
  
  DownLoadCorinthainPo(Po:POs){
    let FileName = Po.corinthianPOAttach
    DownLoadFile(Directories.CorinthainPo,FileName);
  }
  VeiwDetails(P: POs) {
    this.dialog.open(PoDetailsComponent, {
      height: '30rem',
      width: '55rem',
      data: [P,Functionalities.Corinthain],
    });
  }
  AdjustingDataForDisplay(approvalStatus: boolean){
    return AdjustingDataForDisplay(approvalStatus);
  }
  GetPos(){
    this.poservice.GetPos().then((res: any) => {
      this.mydata = res;
      this.mydata = OrderPosByDate(this.mydata);
      this.PagesCount = Math.ceil(this.mydata.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0);
      this.progressRef.complete()
    },(err:any) => {
      Auth_error_handling(err,this.progressRef,this.notification,this.router)
    })
  }
}
