import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Dealers } from 'src/app/Models/Dealers';
import { port } from 'src/app/Models/port';
import { DealersService } from 'src/app/Services/dealers.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { PortService } from 'src/app/Services/port.service';
import { RemoveSearchDisclaimer, ShowSearchDisclaimer, Spinner } from 'src/app/Utilities/Common';
import { CheckDealersToMatchOfflineDB, DeleteDealer, PromiseAllDealers } from 'src/app/Utilities/DealersCRUD';
import { CompareDealerNames, FilterDealersByName } from 'src/app/Utilities/DealersHandlers';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { EditdealerinformationComponent } from '../editdealerinformation/editdealerinformation.component';

@Component({
  selector: 'app-dealers',
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.sass']
})
export class DealersComponent implements OnInit {

  Ports: port[] = []
  Dealers: Dealers[] = [];
  PageCountArray: number[] = [0]
  PagesCount: number = 1;
  DataRowsInPage: number = 15;
  DataOfCurrentPage: Dealers[] = [];
  CurrentPage: number = 0;

  constructor(private dialog: MatDialog,
    private spinner: Spinner,
    private router: Router,
    private NotificationService: NotificationserService,
    private DealerServies: DealersService,
    private PortService: PortService) { }

  ngOnInit(): void {
    this.GetAllDealers();
    this.GetAllPorts();
  }

  GetPortName(PortId: string){
    return this.Ports.find(port => port._id == PortId)?.portName || ""
  }
  GetAllPorts() {
    this.spinner.WrapWithSpinner(this.PortService.GetPorts()
      .then(
        (ports: any) => { this.Ports = ports },
        (err) => Auth_error_handling(err, this.NotificationService, this.router)
      ))
  }
  GetAllDealers() {
    this.spinner.WrapWithSpinner(this.DealerServies.GetAllDealers().then((dealers: any) => {
      this.Dealers = dealers
      this.Dealers.sort((a, b) => CompareDealerNames(a.name, b.name));
      this.PagesCount = Math.ceil(this.Dealers.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0)
      console.log(this.Dealers)
    }))
  }

  async Delete(Dealer: Dealers) { }
  OpenEditDealerForm(Dealer: Dealers) {
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
      RemoveSearchDisclaimer();
      this.DataOfCurrentPage = DealersForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage)
      this.CurrentPage = PageNumber;
    } else {
      this.DataOfCurrentPage = [];
      ShowSearchDisclaimer(this.DataOfCurrentPage.length);
    }
  }
  NextPage() {
    this.SliceDataForPaginantion(this.CurrentPage + 1)
  }
  PreviousPage() {
    this.SliceDataForPaginantion(this.CurrentPage - 1)

  }

  SearchDealersByDealerName(event: any) {
    this.SliceDataForPaginantion(0, FilterDealersByName(this.Dealers, event.target.value))
  }
  ViewDealerProfile(Dealer: Dealers) {
    this.router.navigate(['/DealerProfile', Dealer._id]);
  }
}
