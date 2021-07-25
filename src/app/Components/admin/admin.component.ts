import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { AdminReviewComponent } from '../admin-review/admin-review.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  ShowRowNumber: boolean = true;
  ShowDealerName: Boolean = true;
  ShowDealerPhone: boolean = true;
  ShowCorinthainPoNo: boolean = true;
  ShowUser: boolean = true;
  ShowContainerNumber: boolean = true;
  ShowFactoryETA: boolean = true;
  ShowFactoryESA: boolean = true;
  ShowDate: boolean = true;
  ShowStatus: boolean = true;
  ShowBooked: Boolean = true;
  ShowApproved: boolean = true;


  mydata: POs[] = [
    {
      id: 1,
      dealerName: "test1",
      dealerPONumber: "test1",
      mackPONumber: "tse1",
      corinthianPO: "test1",
      itemID: 0,
      supplierName: "test1",
      userID: "test",
      mackPOAttach: "",
      corinthianPOAttach: "",
      shippingDocs: "",
      comments: "setse",
      alfemoComments: "test",
      status: "tseetssetest",
      productionRequestDate: "tsets",
      factoryEstimatedShipDate: "setsetse",
      dateReceived: "tsetsetste",
      factoryEstimatedArrivalDate: "11111111",
      booked: false,
      finalDestLocation: "22222222",
      containerNumber: "333",
      productionRequestTime: "123123",
      approvalStatus: true
    },
    {
      id: 1,
      dealerName: "test",
      dealerPONumber: "test",
      mackPONumber: "tse",
      corinthianPO: "test",
      itemID: 0,
      supplierName: "test",
      userID: "test",
      mackPOAttach: "test",
      corinthianPOAttach: "1",
      shippingDocs: "stst",
      comments: "setse",
      alfemoComments: "test",
      status: "tseetssetest",
      productionRequestDate: "tsets",
      factoryEstimatedShipDate: "setsetse",
      dateReceived: "tsetsetste",
      factoryEstimatedArrivalDate: "1",
      booked: false,
      finalDestLocation: "22222222",
      containerNumber: "333",
      productionRequestTime: "123123",
      approvalStatus: true
    }
  ];
  DataRowsInPage: number = 15;
  PagesCount: number = 1;
  PageCountArray: number[] = [0];
  DataOfCurrentPage: POs[] = [];
  CurrentPage: number = 0;

  progressRef: any;

  constructor(
    private poservice: POsService,
    private dialog: MatDialog,
    private router: Router,
    private progress: NgProgress,
    private notification: NotificationserService
  ) {
  }

  ngOnInit(): void {

    CheckToken(this.router);
    
    this.progressRef = this.progress.ref('myProgress');

    this.progressRef.start();
    this.poservice.GetPos().then((res: any) => {
      this.mydata = res;

      this.mydata.reverse();
      this.PagesCount = Math.ceil(this.mydata.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0);
      this.progressRef.complete();
    }, (err: any) => {
      Auth_error_handling(err, this.progressRef, this.notification, this.router)

    })
    this.mydata.reverse();
    this.PagesCount = Math.ceil(this.mydata.length / this.DataRowsInPage);
    this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
    this.SliceDataForPaginantion(0);

  }
  Review(P: POs) {
    let dialogRef = this.dialog.open(AdminReviewComponent, {
      height: '500px',
      width: '800px',
      data: P
    });
  }

  SliceDataForPaginantion(PageNumber: number) {
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if (this.mydata.slice(SliceBegining, SliceBegining + this.DataRowsInPage).length > 1) {
      this.DataOfCurrentPage = this.mydata.slice(SliceBegining, SliceBegining + this.DataRowsInPage)
      this.CurrentPage = PageNumber;
    }
  }
  NextPage() {
    this.SliceDataForPaginantion(this.CurrentPage + 1)
  }

  PreviousPage() {
    this.SliceDataForPaginantion(this.CurrentPage - 1)
  }
}
