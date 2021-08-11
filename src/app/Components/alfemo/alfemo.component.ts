import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { element } from 'protractor';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { AdjustingDataForDisplay, Directories, DownLoadFile, Functionalities, Spinner, StaticData } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { AlfemoUpdateComponent } from '../alfemo-update/alfemo-update.component';
import { PoDetailsComponent } from '../po-details/po-details.component';

@Component({
  selector: 'app-alfemo',
  templateUrl: './alfemo.component.html',
  styleUrls: ['./alfemo.component.css']
})
export class AlfemoComponent implements OnInit {


  

  mydata: POs[] = []
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
      
      
    /*   this.mydata = StaticData
      this.mydata.reverse();
      this.mydata = this.mydata.filter(E => E.approvalStatus == true)
      console.log(this.mydata)
      this.PagesCount = Math.ceil (this.mydata.length / this.DataRowsInPage );
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x,i)=>i)
      this.SliceDataForPaginantion(0);  */
  }

  DownloadMackPo(Index: number) {
     let FileName = this.DataOfCurrentPage[Index].mackPOAttach;
      DownLoadFile(Directories.MackPo,FileName)
  }

  VeiwDetails(P: POs) {
    this.dialog.open(PoDetailsComponent, {
      height: '30rem',
      width: '45rem',
      data: [P,Functionalities.Alfemo],
    });
  }

  SliceDataForPaginantion(PageNumber: number){
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if(this.mydata.slice(SliceBegining,SliceBegining + this.DataRowsInPage).length >=1){
    this.DataOfCurrentPage = this.mydata.slice(SliceBegining,SliceBegining + this.DataRowsInPage)
    this.CurrentPage = PageNumber;
    }
  }
  NextPage(){
    this.SliceDataForPaginantion(this.CurrentPage + 1)
  }

  PreviousPage(){
    this.SliceDataForPaginantion(this.CurrentPage - 1)
  }

  AdjustingDataForDisplay(approvalStatus: boolean){
    return AdjustingDataForDisplay(approvalStatus);
  }
  GetPos(){
   this.spinner.WrapWithSpinner( this.poservice.GetPos().then((res: any) => {
      this.mydata = res;
      this.mydata.reverse();
      this.mydata = this.mydata.filter(E => E.approvalStatus == true)
      this.PagesCount = Math.ceil (this.mydata.length / this.DataRowsInPage );
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x,i)=>i)
      this.SliceDataForPaginantion(0);
    },(err:any) => {
      Auth_error_handling(err,this.notification,this.router)
    }))
  }
}
