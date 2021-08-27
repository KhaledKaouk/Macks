import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dealers } from 'src/app/Models/Dealers';
import { FilterDealersByName } from 'src/app/Utilities/Common';
import { CheckDealersToMatchOfflineDB, DeleteDealer, PromiseAllDealers } from 'src/app/Utilities/DealersCRUD';
import { EditdealerinformationComponent } from '../editdealerinformation/editdealerinformation.component';

@Component({
  selector: 'app-dealers',
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.sass']
})
export class DealersComponent implements OnInit {

  Dealers: Dealers[] = [];
  PageCountArray: number[] = [0]
  PagesCount: number = 1;
  DataRowsInPage: number = 15;
  DataOfCurrentPage: Dealers[] = [];
  CurrentPage: number = 0;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    PromiseAllDealers().then((res: any) => {
      this.Dealers = res;
      this.Dealers.sort((a, b) => {
        if (a.name[0].toLowerCase() > b.name[0].toLowerCase()) return +1
        if (a.name[0].toLowerCase() < b.name[0].toLowerCase()) return -1
        return 0
      });
      this.PagesCount = Math.ceil(this.Dealers.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0)
    })  
  }
  FilterByDealerName(event: any) {
    this.SliceDataForPaginantion(0,FilterDealersByName(this.Dealers,event.target.value))
  }
  async Delete(Dealer: Dealers) {
    if (confirm("Are You Sure You Want To Delete This Dealer?")) {
      await DeleteDealer(Dealer);
      location.reload();
    }

  }
  Edit(Dealer: Dealers) {
    this.dialog.open(EditdealerinformationComponent, {
      height: '60rem',
      width: '30rem',
      data: Dealer
    })
  }
  SliceDataForPaginantion(PageNumber: number, Dealers?: Dealers[]) {
    let DealersForSlicing: Dealers[] = this.Dealers;
    if (Dealers) DealersForSlicing = Dealers;
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if (DealersForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage).length >= 1) {
      this.DataOfCurrentPage = DealersForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage)
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
