import { compileFactoryFunction } from "@angular/compiler";
import { Injectable, Injector, Pipe, PipeTransform, Type } from "@angular/core";
import { async } from "@angular/core/testing";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { NgProgress, NgProgressRef } from "ngx-progressbar";
import { promise } from "protractor";
import { AppComponent } from "../app.component";
import { Dealers } from "../Models/Dealers";
import { frightPrices } from "../Models/frightPrices";
import { POs } from "../Models/Po-model";
import { NotificationserService } from "../Services/notificationser.service";
import { POsService } from "../Services/pos.service";
import { Auth_error_handling } from "./Errorhadling";
import * as XLSX from 'xlsx';
import { DealersService } from "../Services/dealers.service";
import { StringDecoder } from "string_decoder";
import { unwatchFile } from "fs";
import { DatePipe } from "@angular/common";
import { port } from "../Models/port";

export function AddPreffixAndExtention(Preffix: string, FileNameBody: string, GetExtentionFrom: string) {
    let extenstion: string = GetExtentionFrom;
    extenstion = extenstion.substring(extenstion.lastIndexOf('.'));

    let AdjustedFileName: string = Preffix + FileNameBody + extenstion;

    return AdjustedFileName;
}

export async function UploadFile<T>(
    PoService: POsService,
    FormData: FormData,
    FileName: string,
    Notification: NotificationserService,
    spinner: Spinner,
    router: Router,
    dialogref?: MatDialogRef<T>) {

    let result: boolean = true;
    spinner.ShowSpinner();
    if (dialogref) HideDialog(dialogref)
    await PoService.Uploadfile(FormData, FileName).toPromise().then((res: any) => {
        if (res == true) {
            result = res;
            return true;
        } else {
            Notification.OnError("The File Was Not Uploaded Please Try Again Later");
            result = false;
            return false;
        }
    },
        (err) => {
            Auth_error_handling(err, Notification, router);
            result = false;
            return false;
        }).finally(() => {
            spinner.HideSppiner();
            if (dialogref) ShowDialog(dialogref)
        });
    return result
}


export function DownLoadFile(Directory: string, FileName: string) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'https://macksdistribution.com/Attatchments/' + Directory + FileName);
    link.setAttribute('download', FileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
}
export let Directories: { [key: string]: string } = {
    MackPo: "MP/",
    ShippingDocument: "SD/",
    CorinthainPo: "NP/"
}

export function ProgrssBar(Promise: Promise<any>, ProgrssRef: NgProgressRef) {
    ProgrssRef.start();
    Promise.finally(() => { ProgrssRef.complete() })
}

export function AdjustingDataForDisplay(ApprovedStatus: boolean) {
    if (ApprovedStatus == true) {
        return "Approved";
    } else {
        return "Pendding approval"
    }
}
export let Functionalities: { [key: string]: string[] } = {
    Admin: ["Approve", "MackPo", "ShippingDocs", "Reject", "CorinthainPo", "ApplyChanges", "MackUpload", "Delete"],
    Corinthain: ["ShippingDocs", "CorinthainPo", "ProductionRequestDate"],
    Alfemo: ["MackPo", "Update"]
}

export function OrderPosByDate(Pos: POs[]) {
    return Pos.reverse();
}

export type Tools = {
    notifications: NotificationserService,
    progress: NgProgress,
    router: Router,
    dialog: MatDialog

}

export function CapitlizeFirstLater(anyString: string) {
    return anyString.replace(anyString[0], anyString[0].toUpperCase())
}
@Injectable({
    providedIn: 'root'
})
export class Spinner {

    constructor(private app: AppComponent) { }

    WrapWithSpinner<T>(Promise: Promise<any>, dialogref?: MatDialogRef<T>) {
        this.app.ShowSpinner();
        if (dialogref) HideDialog(dialogref)
        Promise.finally(() => {
            this.app.HideSpinner();
            if (dialogref) ShowDialog(dialogref);
        })
    }
    HideSppiner() {
        this.app.HideSpinner();
    }
    ShowSpinner() {
        this.app.ShowSpinner();
    }
}
export function FilterPosBy(ListOfPos: POs[], SearchKey: string) {
    return ListOfPos.filter(Po => CheckField(Po.corinthianPO, SearchKey) || CheckField(Po.dealerPONumber, SearchKey) || CheckField(Po.dealerName, SearchKey) || CheckField(Po.mackPONumber, SearchKey))
}
function CheckField(Filed: string, SearchKey: string) {
    return Filed.toLowerCase().includes(SearchKey.toLowerCase())
}

@Pipe({ name: 'EmptyField' })
export class EmptyField implements PipeTransform {
    transform(PoProperty: string | null) {
        if (PoProperty == "" || PoProperty == null) { return "Unavailable" } else { return PoProperty }
    }
}
export function ShowDialog<T>(dialogref: MatDialogRef<T>) {
    dialogref.updatePosition({ top: '4.5rem' })
    dialogref.updateSize('55rem', '30rem')
    dialogref.disableClose = false;
}
export function HideDialog<T>(dialogref: MatDialogRef<T>) {
    dialogref.disableClose = true;
    dialogref.updateSize('0px', '0px')
    dialogref.updatePosition({ top: '-200px' })
}

export function CreateDatabase() {
    let DB = window.indexedDB.open("Dealers");

    DB.onupgradeneeded = function (event) {
        let db = DB.result;
        let Store = db.createObjectStore("DealersInfo", { keyPath: "Id" })
    }
}
export function DeleteTestingPos(PoService: POsService) {
    PoService.GetPos().then((res: any) => {
        let Pos: POs[] = res;
        let DisposablePos: POs[] = Pos.filter(Po => { Po.dealerName === "khaled" || Po.dealerName === "Alex" || Po.dealerName === "new test" })
        DisposablePos.forEach(async (Po) => {
            Po.deleted = true;
            await PoService.UpdatePo(Po).toPromise().then();
        })
    })
}
export let InDevMode = localStorage.getItem('DevMode')?.toLowerCase() === "true" ? true : false

export function FilterDealersByName(ListOfDealers: Dealers[], DealerName: string) {
    return ListOfDealers.filter(Dealer => Dealer.name.toLowerCase().includes(DealerName.toLowerCase()))
}
export function FilterPortsByNameAndCity(ListOfPorts: port[], SearchKeyWord: string){
    return ListOfPorts.filter(Port => Port.portName.toLowerCase().includes(SearchKeyWord.toLowerCase()) || Port.city.toLowerCase().includes(SearchKeyWord.toLowerCase()))
}

export function ColorTR() {
    let PoRows = document.getElementsByTagName('tr');
    let DisClaimerIsOff = document.getElementById('SearchDisclaimer') == null
    if (DisClaimerIsOff) Array.from(document.getElementsByTagName('tr')).forEach((Tr, index) => {
        if (index != 0) {
            if (Tr.children[4].textContent?.toLowerCase().trim() == "pendding approval") Tr.style.borderLeft = '7px solid #800000'
            if (Tr.children[4].textContent?.toLowerCase().trim() == "approved") Tr.style.borderLeft = '7px solid coral'
            if (Tr.children[3].textContent?.toLowerCase().trim() == "shipped") Tr.style.borderLeft = '7px solid green'
        }
    })
}

export function ExportPosToXLSX(Pos: POs[]) {
    let worksheet = XLSX.utils.json_to_sheet(Pos);
    let workbook = XLSX.utils.book_new();
    workbook = { Sheets: { 'Pos': worksheet }, SheetNames: ["Pos"] }
    XLSX.writeFile(workbook, "POs.xlsx")
}

export function RemoveSlashes(ForTrmining: string) {
    return ForTrmining.replace(/\\|\//g, "")
}

export function CheckCorinthianUserPermissions() {
    let HolleyUser: string = "HolleyF"
    return localStorage.getItem('username')?.toLowerCase() === HolleyUser.toLowerCase()
}
export function ShowSearchDisclaimer(PoCount: number) {
    let tobody = document.getElementById('tbody')
    if (tobody) if (PoCount >= 1) {

    } else {
        if (!document.getElementById('SearchDisclaimer')) {
            let TrElement = document.createElement('tr');
            let SearchDisclaimer = document.createElement('td')

            SearchDisclaimer.textContent = "No Results are Found"
            SearchDisclaimer.id = 'SearchDisclaimer'
            let TrInsideTbody = tobody.appendChild(TrElement)
            TrInsideTbody?.appendChild(SearchDisclaimer)
        }
    }
}

export function RemoveSearchDisclaimer() {
    let SearchDisclaimer = document.getElementById('SearchDisclaimer');
    if (SearchDisclaimer) SearchDisclaimer.remove();
}

export async function CheckDealersForDuplicate(InspectedDealer: Dealers, DealerService: DealersService) {
    let IsDupicate: boolean = false;
    await DealerService.GetAllDealers().then((res: any) => {
        let Dealers: Dealers[] = res;
        IsDupicate = Dealers.filter(Dealer => Dealer.name.toLowerCase() == InspectedDealer.name.toLowerCase()).length > 0
    })
    console.log(IsDupicate)
    return IsDupicate
}
export function GenerateReoprt(Pos: POs[]) {
    let RandomPo = Pos[0]
    let { dealer_id, ...rest } = RandomPo;
    let worksheet = XLSX.utils.json_to_sheet(Pos);
    let workbook = XLSX.utils.book_new();
    workbook = { Sheets: { 'Pos': worksheet }, SheetNames: ["Pos"] }
    XLSX.writeFile(workbook, "POs.xlsx")
}
export function GenerateFilterdReport(AllPos: POs[], WantedFields: string[]) {
    let Report = new Array();
    if (AllPos != []) {
        const UnWantedFileds = Object.keys(AllPos[0]).filter(key => !WantedFields.some(name => key == name))
        AllPos.forEach(Po => {
            let { [UnWantedFileds[0]]: id1,
                [UnWantedFileds[1]]: id2,
                [UnWantedFileds[2]]: id3,
                [UnWantedFileds[3]]: id4,
                [UnWantedFileds[4]]: id5,
                [UnWantedFileds[5]]: id6,
                [UnWantedFileds[6]]: id7,
                [UnWantedFileds[7]]: id8,
                [UnWantedFileds[8]]: id9,
                [UnWantedFileds[9]]: id0,
                [UnWantedFileds[10]]: id11,
                [UnWantedFileds[11]]: id12,
                [UnWantedFileds[12]]: id123,
                [UnWantedFileds[13]]: id14,
                [UnWantedFileds[14]]: id15,
                [UnWantedFileds[15]]: id16,
                [UnWantedFileds[16]]: id17,
                [UnWantedFileds[17]]: id18,
                [UnWantedFileds[18]]: id19,
                [UnWantedFileds[19]]: id20,
                [UnWantedFileds[20]]: id21,
                [UnWantedFileds[21]]: id22,
                [UnWantedFileds[22]]: id23,
                [UnWantedFileds[23]]: id24,
                [UnWantedFileds[24]]: id25,
                [UnWantedFileds[25]]: id26,
                [UnWantedFileds[26]]: id27,
                ...WantedFields } = Po
            Report.push(WantedFields);
        })
        let worksheet = XLSX.utils.json_to_sheet(Report);
        let workbook = XLSX.utils.book_new();
        workbook = { Sheets: { 'Pos': worksheet }, SheetNames: ["Pos"] }
        XLSX.writeFile(workbook, "macksdistribution_Pos_Report_" + new Date().toLocaleDateString() + ".xlsx")
        // return XLSX.writeFile(workbook, "macksdistribution_Pos_Report_" + new Date().toLocaleDateString() + ".xlsx")
    }
}
export function GenerateDefaultReport(AllPos: POs[]) {
    let Report = new Array();
    if (AllPos != []) {
        AllPos.forEach(Po => {
            let wantedFields = {
                Shipper: 'ALFEMO',
                Customer: Po.dealerName,
                'PO#': Po.dealerPONumber,
                'Delivery Destination': Po.finalDestLocation,
                'Requested Ship Date': Po.shipBy,
                Status: Po.status,
                'Estimated Ship Date': Po.factoryEstimatedShipDate,
                'Container Bokking Confirmed': Po.status == 'Container Booked' ? 'Yes' : 'No',

            }
            Report.push(wantedFields);
        })
        let worksheet = XLSX.utils.json_to_sheet(Report);
        let workbook = XLSX.utils.book_new();
        workbook = { Sheets: { 'Pos': worksheet }, SheetNames: ["Pos"] }
        XLSX.writeFile(workbook, "macksdistribution_Pos_Report_" + new Date().toLocaleDateString() + ".xlsx")
    }
}
export function FilterPosByShipDate(POsList: POs[],FromShipDate: string, ToShipDate: string){
    return POsList.filter(Po => (Po.factoryEstimatedShipDate > FromShipDate) && (Po.factoryEstimatedShipDate < ToShipDate) )
}
export async function CreateMackPo(CorinthianPo: File, FileName: string) {


    let arrayBuffer: any;
    await CorinthianPo.arrayBuffer().then((buffer) => { arrayBuffer = buffer })
    var data = new Uint8Array(arrayBuffer);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
    var workbook = XLSX.read(bstr, { type: "binary" });
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    worksheet['J17'] = '';
    worksheet['J18'] = '';
    worksheet['J19'] = '';
    worksheet['J20'] = '';
    worksheet['J21'] = '';
    worksheet['J22'] = '';
    worksheet['M17'] = '';
    worksheet['M18'] = '';
    worksheet['M19'] = '';
    worksheet['M20'] = '';
    worksheet['M21'] = '';
    worksheet['M22'] = '';
    worksheet['M23'] = '';
    worksheet['O17'] = '';
    worksheet['O18'] = '';
    worksheet['O19'] = '';
    worksheet['O20'] = '';
    worksheet['O21'] = '';
    worksheet['O22'] = '';
    worksheet['O23'] = '';
    worksheet['Q17'] = '';
    worksheet['Q18'] = '';
    worksheet['Q19'] = '';
    worksheet['Q20'] = '';
    worksheet['Q21'] = '';
    worksheet['Q22'] = '';
    worksheet['Q23'] = '';
    workbook = { Sheets: { 'Pos': worksheet }, SheetNames: ["Pos"] }

    var out = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    let blob = new Blob([s2ab(out)], { type: "application/octet-stream" });
    let MackPo = new File([blob], FileName)
    return MackPo
}
function s2ab(s: any) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}
export function FormatPoDateFields(Po: POs) {
    Po.factoryEstimatedArrivalDate = new DatePipe('en-US').transform(Po.factoryEstimatedArrivalDate, 'YYYY-MM-dd') || "";
    Po.factoryEstimatedShipDate = new DatePipe('en-US').transform(Po.factoryEstimatedShipDate, 'YYYY-MM-dd') || "";
    Po.dateReceived = new DatePipe('en-US').transform(Po.dateReceived, 'YYYY-MM-dd') || "";
    Po.invoiceDate = new DatePipe('en-US').transform(Po.invoiceDate, 'YYYY-MM-dd') || "";
    Po.productionRequestDate = new DatePipe('en-US').transform(Po.productionRequestDate, 'YYYY-MM-dd') || "";
    Po.productionRequestTime = new DatePipe('en-US').transform(Po.productionRequestTime, 'YYYY-MM-dd') || "";
    Po.shipBy = new DatePipe('en-US').transform(Po.shipBy, 'YYYY-MM-dd') || "";
}

