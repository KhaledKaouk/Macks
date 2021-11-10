import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { read } from 'fs';
import { parse } from 'path';
import { $ } from 'protractor';
import { Dealers } from 'src/app/Models/Dealers';
import { POs } from 'src/app/Models/Po-model';
import { DealersService } from 'src/app/Services/dealers.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { GetRole } from 'src/app/Utilities/CheckAuth';
import { CompareDealerNames } from 'src/app/Utilities/DealersHandlers';
import { FormatPoDateFields } from 'src/app/Utilities/PoHandlers';
import { FilterPosByShipDate, GenerateDefaultReport, GenerateFilterdReport, GenerateWeeklyReport } from 'src/app/Utilities/ReportsHandlers';

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
  WantedFileds: string[] = [];
  Dealers: Dealers[] = [];
  WantedDealersId: number[] = [];
  WantedDealerPo: string[] = [];
  WantedCorinthainPo: string[] = [];

  Options = new FormGroup({
    DealerId: new FormControl(),
    FromShipDate: new FormControl(),
    ToShipDate: new FormControl()
  })
  constructor(private PosServise: POsService,
    private DealerServise: DealersService,
    private notifications: NotificationserService) { }

  ngOnInit(): void {
    this.GetAllDealers();
    this.GetAllPos();
    this.WantedFileds = this.AllFields

  }
  GetAllDealers() {
    this.DealerServise.GetAllDealers().then((res: any) => {
      this.Dealers = res
      this.Dealers.sort((a, b) => CompareDealerNames(a.name, b.name));
    })
  }
  async GetAllPos() {
    await this.PosServise.GetPos().then((res: any) => {
      this.AllPos = res;
      this.AllPos = this.FilterPosForAlfemo();
      this.AllPos.forEach(Po => {
        FormatPoDateFields(Po)
      })
      this.keys = Object.keys(this.AllPos[0])
    })
  }
  FilterPosForAlfemo(){
    let AllowdPos: POs[] = this.AllPos;
    if (GetRole()?.toLowerCase() == 'alfemo') AllowdPos = this.AllPos.filter(Po => Po.approvalStatus == true)
    return AllowdPos
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
    if (Checked) { this.WantedFileds = this.AllFields; } else { this.WantedFileds = [] }
  }
  GenerateReport() {

    let PosWithNoDuplicate = this.FilterPosByDealrs().filter(Po => !this.FilterPoByDealerPo().includes(Po));
    let FilteredPos = PosWithNoDuplicate.concat(this.FilterPoByDealerPo());
    let PosWithNoDuplicate2 = FilteredPos.filter(Po => !this.FilterPoByCorinthianPo().includes(Po))
    FilteredPos = PosWithNoDuplicate2.concat(this.FilterPoByCorinthianPo());
    let PosFilteredByShipDate = FilterPosByShipDate(this.AllPos, this.GetFromShipDateKey(), this.GetToShipDateKey());
    let PosWithNoDuplicate3 = FilteredPos.filter(Po => !PosFilteredByShipDate.includes(Po))
    FilteredPos = PosWithNoDuplicate3.concat(PosFilteredByShipDate)

    if (!this.NotifyUserOfNoPos(FilteredPos)) GenerateFilterdReport(FilteredPos, this.WantedFileds)

  }

  NotifyUserOfNoPos(Pos: POs[]) {
    let PosAreEmpty = Pos.length == 0;
    if (PosAreEmpty) this.notifications.DisplayInfo("No Pos Matches Your Search Keys")
    return PosAreEmpty
  }
  GetFromShipDateKey() {
    return this.Options.get('FromShipDate')?.value
  }
  GetToShipDateKey() {
    return this.Options.get('ToShipDate')?.value
  }
  SetUpFormDateValue() {
    this.Options.setValue({
      DealerId: '',
      FromShipDate: new DatePipe('en-US').transform(Date.now(), 'YYYY-MM-dd'),
      ToShipDate: new DatePipe('en-US').transform(Date.now(), 'YYYY-MM-dd'),
    })
  }

  GenerateDefaultReport() {
    GenerateDefaultReport(this.AllPos)
  }
  GenerateWeeklyReport(){
    GenerateWeeklyReport(this.AllPos);
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

    SearchKey = this.ConverDealerIdToInt(SearchKey, IsDealer)
    if (this.CheckSearchKeyValidations(event.key, SearchKey, IsDealer)) {
      SearchKeyList.push(SearchKey)
      if (IsDealer) {
        this.CreateSearchKeyElement(SearchKey, SearchKeyList, this.GetDealerName(event.target))
      } else {
        this.CreateSearchKeyElement(SearchKey, SearchKeyList)
        event.target.value = "";
      }
    }
  }
  GetDealerName(HtmlSelectElement: any) {
    let SelectElement = HtmlSelectElement as HTMLSelectElement
    let Option = SelectElement.selectedIndex
    let DealerName = SelectElement[Option].textContent || ""

    return DealerName;
  }
  CheckSearchKeyValidations(key: string, SearchKey: string, IsDealer?: boolean) {
    let Valid: boolean

    let SearchKeyAlreadyExist = document.getElementById(SearchKey) != null

    Valid = key == "Enter" && this.CheckSearchKeyValue(SearchKey) && !SearchKeyAlreadyExist
    if (IsDealer) Valid = !SearchKeyAlreadyExist

    return Valid
  }
  ConverDealerIdToInt(SearchKey: string, IsDealer?: boolean) {
    let ConvertedSearchKey: number | string = SearchKey
    if (IsDealer) ConvertedSearchKey = parseInt(SearchKey)

    return ConvertedSearchKey
  }
  CheckSearchKeyValue(SearchKey: string) {
    return SearchKey != ""
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
