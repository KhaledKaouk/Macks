import * as XLSX from 'xlsx';

export function ConvertExcelFileIntoHtml(WorkSheet: XLSX.WorkSheet){
    return XLSX.utils.sheet_to_html(WorkSheet)
}
export async function GetWorkSheet(File: File) {
    let arrayBuffer: any;
    await File.arrayBuffer().then((buffer) => { arrayBuffer = buffer })
    var data = new Uint8Array(arrayBuffer);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
    var workbook = XLSX.read(bstr, { type: "binary" });
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];

    return worksheet
  }

// let El = document.getElementById('TT');
// if(El) El.innerHTML =  this.html = XLSX.utils.sheet_to_html(WorkSheet)