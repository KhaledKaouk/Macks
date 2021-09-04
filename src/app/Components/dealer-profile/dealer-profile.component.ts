import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Dealers } from 'src/app/Models/Dealers';
import { POs } from 'src/app/Models/Po-model';
import { DealersService } from 'src/app/Services/dealers.service';
import { POsService } from 'src/app/Services/pos.service';
import { AdjustingDataForDisplay, FilterPosBy, Functionalities, RemoveSearchDisclaimer, ShowSearchDisclaimer, Spinner } from 'src/app/Utilities/Common';
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
  DataRowsInPage: number = 15;
  DataOfCurrentPage: POs[] = [];
  CurrentPage: number = 0;

  constructor(
    private dialog : MatDialog,
    private spinner: Spinner,
    private ActivatedRoute: ActivatedRoute,
    private DealerService: DealersService,
    private Poservice: POsService ) { }

  ngOnInit(): void {
    let DealerId = this.ActivatedRoute.snapshot.paramMap.get('DealerId') || "";
    this.spinner.WrapWithSpinner(this.DealerService.GetAllDealers().then((res:any) => {
      this.AllDealers = res
      this.Dealer = this.AllDealers.find(Dealer => Dealer.id == DealerId) || this.Dealer;
    }))
    this.spinner.WrapWithSpinner(this.Poservice.GetPos().then((res: any) => {
      this.AllPos = res;
      this.AllPos =  this.AllPos.filter(Po => Po.dealer_id == DealerId)
      this.AllPos.reverse();
      this.PagesCount = Math.ceil(this.AllPos.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0);
    }))
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
    return AdjustingDataForDisplay(approvalStatus);
  }
  SearchPos(event: any){
    this.SliceDataForPaginantion(0,FilterPosBy(this.AllPos,event.target.value))
  }
  VeiwPoDetails(P: POs) {
    let dialogRef = this.dialog.open(PoDetailsComponent, {
      height: '30rem',
      width: '55rem',
      data: [P,Functionalities.Corinthain],
    });
  }
}
