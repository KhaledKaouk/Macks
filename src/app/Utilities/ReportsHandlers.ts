import { POs } from "../Models/Po-model";
import * as XLSX from 'xlsx';

export function ExportPosToXLSX(Pos: POs[]) {
    let worksheet = XLSX.utils.json_to_sheet(Pos);
    let workbook = XLSX.utils.book_new();
    workbook = { Sheets: { 'Pos': worksheet }, SheetNames: ["Pos"] }
    XLSX.writeFile(workbook, "POs.xlsx")
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
export function GenerateWeeklyReport(AllPos: POs[]) {
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
                'Date of Departure': Po.dateOfDeparture,
                'Carrier': '',
                'Container#': Po.containerNumber,
                'Remarks/BOL': '',
                'Style': '',
                'Production Start Date': Po.productionStartDate,
                'Production Complete': Po.productionFinishDate,
                'Booking request': '',
                'Shipt To vessel': '',
                'Freight Rate': '',  

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
