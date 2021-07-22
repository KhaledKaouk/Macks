import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { POs } from 'src/app/Models/Po-model';
import { POsService } from 'src/app/Services/pos.service';
import { AlfemoUpdateComponent } from '../alfemo-update/alfemo-update.component';

@Component({
  selector: 'app-alfemo',
  templateUrl: './alfemo.component.html',
  styleUrls: ['./alfemo.component.css']
})
export class AlfemoComponent implements OnInit {


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

  SearchValue: String = "";

  mydata: POs[] = [
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
     corinthianPOAttach: "test",
     ShippingDocs: "stst",
     comments: "setse",
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
     ShippingDocs: "stst",
     comments: "setse",
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
  
  constructor(private dialog: MatDialog,
    private poservice: POsService,
    private router: Router) { }

  ngOnInit(): void {

    if (!sessionStorage.getItem('token')) {
      this.router.navigateByUrl('/LogIn')
    } else {
      this.poservice.GetPos().then((res: any) => {
        this.mydata = res;
        this.mydata.reverse();
        this.mydata = this.mydata.filter(E => E.approvalStatus == true)
        this.PagesCount = Math.ceil (this.mydata.length / this.DataRowsInPage );
        this.PageCountArray = Array(this.PagesCount).fill(0).map((x,i)=>i)
        this.SliceDataForPaginantion(0);
      })
    }
    this.mydata.reverse();
        this.mydata = this.mydata.filter(E => E.approvalStatus == true)
        this.PagesCount = Math.ceil (this.mydata.length / this.DataRowsInPage );
        this.PageCountArray = Array(this.PagesCount).fill(0).map((x,i)=>i)
        this.SliceDataForPaginantion(0);
  }

  DownloadMackPo(Index: number) {

      let href: string = "";
      let FileName: string ="";
      href  = "MP/" + this.DataOfCurrentPage[Index].mackPOAttach;
      FileName = this.DataOfCurrentPage[Index].mackPOAttach;
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', 'https://macksdistribution.com/Attatchments/' + href);
      link.setAttribute('download', FileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
  }

  Update(P: POs) {
    this.dialog.open(AlfemoUpdateComponent, {
      height: '530px',
      width: '600px',
      data: P
    });
  }


  Search(event: any) {
    this.SearchValue = (String)(event.target.value);

    this.mydata = this.mydata.filter(function (MyPos) {
      return MyPos.dealerName == event.target.value;
    })
  }

  SliceDataForPaginantion(PageNumber: number){
    let SliceBegining = PageNumber * this.DataRowsInPage;
    this.DataOfCurrentPage = this.mydata.slice(SliceBegining,SliceBegining + this.DataRowsInPage)
    this.CurrentPage = PageNumber;
  }
  NextPage(){
    this.SliceDataForPaginantion(this.CurrentPage + 1)
  }

  PreviousPage(){
    this.SliceDataForPaginantion(this.CurrentPage - 1)
  }
}
