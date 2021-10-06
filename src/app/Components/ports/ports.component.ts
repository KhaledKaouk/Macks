import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { port } from 'src/app/Models/port';
import { PortService } from 'src/app/Services/port.service';
import {  RemoveSearchDisclaimer, ShowSearchDisclaimer } from 'src/app/Utilities/Common';
import { FilterPortsByNameAndCity } from 'src/app/Utilities/PortHandlers';
import { UpdatePortComponent } from '../update-port/update-port.component';

@Component({
  selector: 'app-ports',
  templateUrl: './ports.component.html',
  styleUrls: ['./ports.component.sass']
})
export class PortsComponent implements OnInit {

  Ports: port[] = [];
  PageCountArray: number[] = [0]
  PagesCount: number = 1;
  DataRowsInPage: number = 15;
  DataOfCurrentPage: port[] = [];
  CurrentPage: number = 0;

  constructor(private portService: PortService,
    private MatDialog: MatDialog) { }

  ngOnInit(): void {
    this.GetAllPorts();

  }

  GetAllPorts(){
    this.portService.GetPorts().then((res: any) => {
      this.Ports = res;
      this.PagesCount = Math.ceil(this.Ports.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0)
    })
  }
  UpdatePort(port: port){
    this.MatDialog.open(UpdatePortComponent,{
      height: '30rem',
      width: '30rem',
      data: port
    })
  }
  SearchByPortsAndCities(event: any){
    this.SliceDataForPaginantion(0,FilterPortsByNameAndCity(this.Ports,event.target.value))
    
  }
  NextPage(){
    this.SliceDataForPaginantion(this.CurrentPage + 1)

  }
  PreviousPage(){
    this.SliceDataForPaginantion(this.CurrentPage - 1)

  }
  SliceDataForPaginantion(PageNumber: number,Ports?: port[]){
    if(Ports) console.log(Ports)
    let PortsForSlicing: port[] = this.Ports;
    if (Ports) PortsForSlicing = Ports;
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if (PortsForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage).length >= 1) {
      RemoveSearchDisclaimer();
      this.DataOfCurrentPage = PortsForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage)
      this.CurrentPage = PageNumber;
    }else{
      this.DataOfCurrentPage = [];
      ShowSearchDisclaimer(this.DataOfCurrentPage.length);
    }
  }
}
