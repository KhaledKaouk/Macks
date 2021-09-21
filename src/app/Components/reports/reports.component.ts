import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { read } from 'fs';
import { parse } from 'path';
import { Dealers } from 'src/app/Models/Dealers';
import { POs } from 'src/app/Models/Po-model';
import { DealersService } from 'src/app/Services/dealers.service';
import { POsService } from 'src/app/Services/pos.service';
import { FormatPoDateFields, GenerateDefaultReport, GenerateFilterdReport } from 'src/app/Utilities/Common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.sass']
})
export class ReportsComponent implements OnInit {

  AllPos: POs[] = [];
  keys: string[] = [];
  AllFields: string[] = [
    'dealerName',
    'dealerEmail',
    'dealerPONumber',
    'corinthianPO',
    'shipBy',
    'comments',
    'alfemoComments',
    'status',
    'factoryEstimatedShipDate',
    'factoryEstimatedArrivalDate',
    'finalDestLocation',
    'containerNumber',
    'approvalStatus',
    'invoiceDate',
  ];
  WantedFileds: string[]= []; 
  Dealers: Dealers[] = [];
  WantedDealersId: number[] = [];
  WantedDealerPo: string[] = [];
  WantedCorinthainPo: string[] = [];

  Options = new FormGroup({
    DealerId: new FormControl()
  })
  constructor(private PosServise: POsService,
    private DealerServise: DealersService) { }

  ngOnInit(): void {
    this.GetAllDealers();
    this.GetAllPos();
    this.WantedFileds = this.AllFields
  }
  GetAllDealers() {
    this.DealerServise.GetAllDealers().then((res: any) => {
      this.Dealers = res
      this.Dealers.sort((a, b) => {
        if (a.name[0].toLowerCase() > b.name[0].toLowerCase()) return +1
        if (a.name[0].toLowerCase() < b.name[0].toLowerCase()) return -1
        return 0
      });
    })
  }
  async GetAllPos() {
    await this.PosServise.GetPos().then((res: any) => {
      this.AllPos = res;
      this.AllPos.forEach(Po => {
        FormatPoDateFields(Po)
      })
      this.keys = Object.keys(this.AllPos[0])
    })
  }

  AddOrDeleteIntoReport(event: any) {
    let key = event.srcElement.id
    let Checked = event.target.checked;
    let keyIndex = this.WantedFileds.indexOf(key)

    if (Checked) {
      this.WantedFileds.push(key)
    } else {
      this.WantedFileds.splice(keyIndex, 1)
    }
  }
  AddOrDeleteAllIntoReport(event: any) {
    Array.from(document.querySelectorAll('input[name=CheckBox]')).forEach((CheckItem) => {
      (CheckItem as HTMLInputElement).checked = !(CheckItem as HTMLInputElement).checked;
    })
    let Checked = event.target.checked;
    if(Checked) {this.WantedFileds = this.AllFields;} else { this.WantedFileds = []}
  }
  GenerateReport() {

    let PosWithNoDuplicate = this.FilterPosByDealrs().filter(Po => !this.FilterPoByDealerPo().includes(Po));
    let FilteredPos = PosWithNoDuplicate.concat(this.FilterPoByDealerPo());
    let PosWithNoDuplicate2 = FilteredPos.filter(Po => !this.FilterPoByCorinthianPo().includes(Po))

    FilteredPos = PosWithNoDuplicate2.concat(this.FilterPoByCorinthianPo());
    GenerateFilterdReport(FilteredPos, this.WantedFileds)

  }
  GenerateDefaultReport() {
    GenerateDefaultReport(this.AllPos)
  }

  AddDealerToFilter(event: any) {
    let DealerId = event.target.value;
    let DealerName = "";
    let AlreayAdded = document.getElementById(DealerId) != null;
    if (!AlreayAdded) {
      this.WantedDealersId.push(DealerId);

      let SelectElement = event.target as HTMLSelectElement
      let Option = SelectElement.selectedIndex
      DealerName = SelectElement[Option].textContent || ""

      this.CreateDealerElement(DealerId, DealerName)
    }
  }
  CreateDealerElement(DealerId: number, DealerName: string) {

    let DealerElement = document.createElement('a');
    let DealerRemoveButton = document.createElement('a');

    DealerRemoveButton.textContent = 'X';
    DealerRemoveButton.style.color = 'red';
    DealerRemoveButton.className = "RemoveDealer";
    DealerRemoveButton.onclick = () => {
      document.getElementById(DealerId.toString())?.remove();
      this.WantedDealersId.splice(this.WantedDealersId.indexOf(DealerId), 1)
    }

    DealerElement.textContent = DealerName;
    DealerElement.className = "DealerId";
    DealerElement.id = DealerId.toString();
    DealerElement.appendChild(DealerRemoveButton);

    document.getElementById('Dealers')?.appendChild(DealerElement)
  }
  FilterPosByDealrs() {
    return this.AllPos.filter(Po => this.WantedDealersId.includes(Po.dealer_id))
  }


  FilterPoByDealerPo() {
    return this.AllPos.filter(Po => this.WantedDealerPo.includes(Po.dealerPONumber))
  }
  AddToSearchKeys(event: any, SearchKeyList: (string | number)[], IsDealer?: boolean) {
    let SearchKey = event.target.value;
    if (IsDealer) SearchKey = parseInt(event.target.value)
    let Submit: boolean
    let SearchKeyNotEmpty: boolean
    let SearchKeyAlreadyExist = document.getElementById(SearchKey) != null;
    if (IsDealer) {
      Submit = true;
      SearchKeyNotEmpty = true;
    } else {
      Submit = event.key == "Enter";
      SearchKeyNotEmpty = SearchKey != "";
    }

    if (Submit && SearchKeyNotEmpty && !SearchKeyAlreadyExist) {
      SearchKeyList.push(SearchKey)
      if (IsDealer) {
        let SelectElement = event.target as HTMLSelectElement
        let Option = SelectElement.selectedIndex
        let DealerName = SelectElement[Option].textContent || ""

        this.CreateSearchKeyElement(SearchKey, SearchKeyList, DealerName)
      } else {
        this.CreateSearchKeyElement(SearchKey, SearchKeyList)
        event.target.value = "";
      }
    }
  }
  CreateSearchKeyElement(SearchKey: string, SearchKeyList: (string | number)[], DealerName?: string) {
    let SearchKeyElement = document.createElement('a');
    let RemoveButton = document.createElement('a');

    RemoveButton.textContent = 'X';
    RemoveButton.className = "RemoveDealer";
    RemoveButton.style.color = 'red';
    RemoveButton.onclick = () => {
      document.getElementById(SearchKey)?.remove();
      SearchKeyList.splice(SearchKeyList.indexOf(SearchKey), 1)
    }

    SearchKeyElement.textContent = DealerName ? DealerName : SearchKey;
    SearchKeyElement.className = "DealerId";
    SearchKeyElement.id = SearchKey;
    SearchKeyElement.appendChild(RemoveButton);

    document.getElementById('Dealers')?.appendChild(SearchKeyElement)
  }
  FilterPoByCorinthianPo() {
    return this.AllPos.filter(Po => this.WantedCorinthainPo.includes(Po.corinthianPO))
  }

  AddDealerPoToFilter(event: any) {
    let AlreadyExist = document.getElementById(event.target.value) != null
    if (event.key == "Enter" && event.target.value != "") {
      if (!AlreadyExist) {
        this.WantedDealerPo.push(event.target.value)
        this.CreateDealerPoElement(event.target.value)
        event.target.value = "";
      }
    }
  }
  CreateDealerPoElement(DealerPo: string) {
    let DealerPoElement = document.createElement('a');
    let DealerPoRemoveButton = document.createElement('a');

    DealerPoRemoveButton.textContent = 'X';
    DealerPoRemoveButton.className = "RemoveDealer";
    DealerPoRemoveButton.style.color = 'red';
    DealerPoRemoveButton.onclick = () => {
      document.getElementById(DealerPo)?.remove();
      this.WantedDealerPo.splice(this.WantedDealerPo.indexOf(DealerPo), 1)
    }

    DealerPoElement.textContent = DealerPo;
    DealerPoElement.className = "DealerId";
    DealerPoElement.id = DealerPo;
    DealerPoElement.appendChild(DealerPoRemoveButton);

    document.getElementById('Dealers')?.appendChild(DealerPoElement)
  }
}
