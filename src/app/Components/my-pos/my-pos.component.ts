import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { StaticData } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';

@Component({
  selector: 'app-my-pos',
  templateUrl: './my-pos.component.html',
  styleUrls: ['./my-pos.component.sass']
})
export class MyPosComponent implements OnInit {


  MackFile: boolean[] = [];
  ShippingFile: boolean[] = [];

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
  ShippingDocs: boolean = true;

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
    private router: Router) { }

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
        this.progressRef.complete()
      },(err:any) => {
        Auth_error_handling(err,this.progressRef,this.notification,this.router)
      })
      /*this.mydata = StaticData
      this.mydata.reverse();
      this.PagesCount = Math.ceil(this.mydata.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0);*/
  }

  SliceDataForPaginantion(PageNumber: number){
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if(this.mydata.slice(SliceBegining,SliceBegining + this.DataRowsInPage).length >1){
      this.DataOfCurrentPage = this.mydata.slice(SliceBegining,SliceBegining + this.DataRowsInPage)
      this.MackFile = [];
      this.ShippingFile = [];
    this.DataOfCurrentPage.forEach(elemenet =>{
      if(elemenet.mackPOAttach != ""){

        this.MackFile.push(true)
      }else{
        this.MackFile.push(false)
      }
      if(elemenet.shippingDocs != ""){

        this.ShippingFile.push(true)
      }else{
        this.ShippingFile.push(false)
      }
    })
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
    let href: string = "";
    let FileName: string = "";

    href = "SD/" + Po.shippingDocs;
    FileName = Po.shippingDocs;

    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'https://macksdistribution.com/Attatchments/' + href);
    link.setAttribute('download', FileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  
  DownloadMackPo(Po:POs){
    let href: string = "";
    let FileName: string = "";

    href = "MP/" + Po.mackPOAttach;
    FileName = Po.mackPOAttach;

    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'https://macksdistribution.com/Attatchments/' + href);
    link.setAttribute('download', FileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
