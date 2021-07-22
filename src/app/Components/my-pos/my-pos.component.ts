import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { POs } from 'src/app/Models/Po-model';
import { POsService } from 'src/app/Services/pos.service';

@Component({
  selector: 'app-my-pos',
  templateUrl: './my-pos.component.html',
  styleUrls: ['./my-pos.component.sass']
})
export class MyPosComponent implements OnInit {

  ShowRowNumber: boolean = true;
  ShowDealerName: Boolean = true;
  ShowCorinthainPoNo: boolean = true;
  ShowDate: boolean = true;
  ShowStatus: boolean = true;
  ShowApproved: boolean = true;
  ShippingDocs: boolean = true;

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
      approvalStatus: false  
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
      approvalStatus: false  
    }
  ];
  DataRowsInPage: number = 15;
  PagesCount: number = 1;
  PageCountArray: number[] = [0];
  DataOfCurrentPage: POs[] = [];
  CurrentPage: number = 0;

  constructor(private poservice: POsService,
    private router: Router) { }

  ngOnInit(): void {
    if (!sessionStorage.getItem('token')) {
      this.router.navigateByUrl('/LogIn')
    } else {
      this.poservice.GetPos().then((res: any) => {
        this.mydata = res;
        this.mydata.reverse();
        this.PagesCount = Math.ceil(this.mydata.length / this.DataRowsInPage);
        this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
        this.SliceDataForPaginantion(0);
      })
    }
    this.mydata.reverse();
        this.PagesCount = Math.ceil(this.mydata.length / this.DataRowsInPage);
        this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
        this.SliceDataForPaginantion(0);
  }

  SliceDataForPaginantion(PageNumber: number) {
    let SliceBegining = PageNumber * this.DataRowsInPage;
    this.DataOfCurrentPage = this.mydata.slice(SliceBegining, SliceBegining + this.DataRowsInPage)
    this.CurrentPage = PageNumber;
  }
  NextPage() {
    this.SliceDataForPaginantion(this.CurrentPage + 1)
  }

  PreviousPage() {
    this.SliceDataForPaginantion(this.CurrentPage - 1)
  }
  DownloadShippingDocs(Po: POs) {
    let href: string = "";
    let FileName: string = "";

    href = "SD/" + Po.ShippingDocs;
    FileName = Po.ShippingDocs;

    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'https://macksdistribution.com/Attatchments/' + href);
    link.setAttribute('download', FileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
