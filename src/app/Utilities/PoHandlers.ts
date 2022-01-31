import { POs } from "../Models/Po-model";
import * as XLSX from 'xlsx';
import { DatePipe } from "@angular/common";
import { FormatDate } from "./Common";
import {Dealers } from"../Models/Dealers"
import { GetDealerById } from "./DealersHandlers";
export function AdjustApprovalStatusForDisplay(ApprovedStatus: boolean) {
    if (ApprovedStatus == true) {
        return "Approved";
    } else {
        return "Pendding approval"
    }
}

export function OrderPosByDate(Pos: POs[]) {
    return Pos.reverse();
}

export function FilterPosBy(ListOfPos: POs[],Dealers: Dealers[], SearchKey: string) {
    return ListOfPos.filter(Po => LookForSearchKeyInPo(Po,GetDealerById(Dealers,Po.dealer_id).name, SearchKey))
}
function CheckField(Filed: string, SearchKey: string) {
    return Filed.toLowerCase().includes(SearchKey.toLowerCase())
}
function LookForSearchKeyInPo(Po: POs,DealerName: string,SearchKey: string){
    return CheckField(Po.corinthianPoNumber, SearchKey) || CheckField(Po.dealerPoNumber, SearchKey) || CheckField(DealerName, SearchKey) || CheckField(Po.mackPoNumber, SearchKey)
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
    Po.factoryEstimatedArrivalDate = FormatDate(Po.factoryEstimatedArrivalDate);
    Po.factoryEstimatedShipDate = FormatDate(Po.factoryEstimatedShipDate);
    Po.dateReceived = FormatDate(Po.dateReceived);
    Po.invoiceDate = FormatDate(Po.invoiceDate);
    Po.productionRequestDate = FormatDate(Po.productionRequestDate);
    Po.productionRequestTime = FormatDate(Po.productionRequestTime);
    Po.shipBy = FormatDate(Po.shipBy);
    Po.productionStartDate = FormatDate(Po.productionStartDate);
    Po.productionFinishDate = FormatDate(Po.productionFinishDate);
    Po.dateOfDeparture = FormatDate(Po.dateOfDeparture);
    Po.factoryLoadDate = FormatDate(Po.factoryLoadDate);
}
export function SortPosByShipByDate(POs: POs[]){
    POs.sort((a,b) => CompareDates(a.shipBy,b.shipBy));
}
export function CompareDates(FirstDate: string,SecondDate: string){
    let Result: number = (FormatDate(FirstDate) || "") > (FormatDate(SecondDate) || "")? +1:-1 
    return Result
}
export function RemoveDeletedPOs(POs: POs[]){
    return POs.filter(PO => PO.deleted != true)
}
export function RemoveArchivedPos(Pos: POs[]){
    return Pos.filter(po => po.Archived != true)
}
export function SetUpPOsForDisplay(POs: POs[]){
    return RemoveDeletedPOs(POs).reverse();
}
export function RemoveDissapprovedPos(POs: POs[]){
    return POs.filter(PO => PO.approvalStatus == true)
}
export function FilterPosByDealerId(DealerId: string, POs: POs[]){
    return POs.filter(Po => Po.dealer_id == DealerId)
}

