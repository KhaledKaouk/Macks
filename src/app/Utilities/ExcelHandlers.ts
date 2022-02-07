import * as XLSX from 'xlsx';

export function ViewWscelFileInNewWindow(WorkSheet: XLSX.WorkSheet){
    return XLSX.utils.sheet_to_html(WorkSheet)
}

// let El = document.getElementById('TT');
// if(El) El.innerHTML =  this.html = XLSX.utils.sheet_to_html(WorkSheet)