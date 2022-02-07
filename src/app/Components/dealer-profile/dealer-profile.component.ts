import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Dealers } from 'src/app/Models/Dealers';
import { POs } from 'src/app/Models/Po-model';
import { DealersService } from 'src/app/Services/dealers.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { RemoveSearchDisclaimer, ShowSearchDisclaimer, Spinner } from 'src/app/Utilities/Common';
import { GetDealerById } from 'src/app/Utilities/DealersHandlers';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { AdjustApprovalStatusForDisplay, FilterPosBy, FilterPosByDealerId, SetUpPOsForDisplay } from 'src/app/Utilities/PoHandlers';
import { DataRowInPage, Functionalities } from 'src/app/Utilities/Variables';
import { PoDetailsComponent } from '../po-details/po-details.component';

@Component({
  selector: 'app-dealer-profile',
  templateUrl: './dealer-profile.component.html',
  styleUrls: ['./dealer-profile.component.sass']
})
export class DealerProfileComponent implements OnInit {

  Dealer : Dealers = new Dealers();
  AllDealers: Dealers[] = [];
  AllPos: POs[] = [];

  PageCountArray: number[] = [0];
  PagesCount: number = 1;
  DataRowsInPage: number = DataRowInPage;
  DataOfCurrentPage: POs[] = [];
  CurrentPage: number = 0;

  constructor(
    private dialog : MatDialog,
    private spinner: Spinner,
    private ActivatedRoute: ActivatedRoute,
    private DealerService: DealersService,
    private Poservice: POsService,
    private notification: NotificationserService,
    private router: Router ) { }

  ngOnInit(): void {
    this.SetUpDealersDataForDisplay();
  }

  async GetDealerPos(){
    let AllPos: POs[] = []
    await this.Poservice.GetPos().then(
      (res:any) => {AllPos = SetUpPOsForDisplay(FilterPosByDealerId(this.GetDealerId(),res))},
      (err) => Auth_error_handling(err,this.notification,this.router)  
    )
    return AllPos
  }
  async GetAllDealers(){
    let AllDealers: Dealers[] = []
    await this.DealerService.GetAllDealers().then(
      (res:any) => {AllDealers = res},
      (err) => Auth_error_handling(err,this.notification,this.router)
    )
    return AllDealers
  }
  GetDealerId(){
    return (this.ActivatedRoute.snapshot.paramMap.get('DealerId') || "");
  }
  
  async SetUpDealersDataForDisplay(){
    this.AllDealers = await this.GetAllDealers();
    this.Dealer = GetDealerById(this.AllDealers,this.GetDealerId())
    this.AllPos = await this.GetDealerPos();

    this.PagesCount = Math.ceil(this.AllPos.length / this.DataRowsInPage);
    this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
    this.SliceDataForPaginantion(0);
  }
  SliceDataForPaginantion(PageNumber: number,SearchedPos?:POs[]) {
    let PosForSlicing: POs[] = this.AllPos;
    if(SearchedPos) PosForSlicing = SearchedPos;
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if (PosForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage).length >= 1) {
      RemoveSearchDisclaimer();
      this.DataOfCurrentPage = PosForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage)
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

  
  AdjustApprovalStatusForDisplay(approvalStatus: boolean){
    return AdjustApprovalStatusForDisplay(approvalStatus);
  }
  SearchPos(event: any){
    this.SliceDataForPaginantion(0,FilterPosBy(this.AllPos,this.AllDealers,event.target.value))
  }
  VeiwPoDetails(P: POs) {
    let dialogRef = this.dialog.open(PoDetailsComponent, {
      height: '30rem',
      width: '55rem',
      data: [P,Functionalities.Corinthain],
    });
  }
}
