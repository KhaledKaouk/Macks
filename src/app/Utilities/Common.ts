import { DatePipe, formatDate } from "@angular/common";
import { Injectable, Injector, Pipe, PipeTransform, Type } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AppComponent } from "../app.component";
import { NotificationserService } from "../Services/notificationser.service";
import { POsService } from "../Services/pos.service";


export function AddPreffixAndExtention(Preffix: string, FileNameBody: string, GetExtentionFrom: string) {
    let extenstion: string = GetExtentionFrom;
    extenstion = extenstion.substring(extenstion.lastIndexOf('.'));

    let AdjustedFileName: string = Preffix + FileNameBody + extenstion;

    return AdjustedFileName;
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

@Pipe({ name: 'EmptyField' })
export class EmptyField implements PipeTransform {
    transform(PoProperty: string | null) {
        return PoProperty == "" || PoProperty == null ? "Unavailable" : PoProperty
    }
}

export function ShowDialog<T>(dialogref?: MatDialogRef<T>) {
    if (dialogref) {
        dialogref.updatePosition({ top: '4.5rem' })
        dialogref.updateSize('55rem', '30rem')
        dialogref.disableClose = false;
    }
}

export function HideDialog<T>(dialogref?: MatDialogRef<T>) {
    if (dialogref) {
        dialogref.disableClose = true;
        dialogref.updateSize('0px', '0px')
        dialogref.updatePosition({ top: '-200px' })
    }
}

export function CreateDatabase() {
    let DB = window.indexedDB.open("Dealers");

    DB.onupgradeneeded = function (event) {
        let db = DB.result;
        let Store = db.createObjectStore("DealersInfo", { keyPath: "Id" })
    }
}


export function ColorTR() {
    let DataTableRows = GetDataTableRows();
    if (DataTableRows) DataTableRows.forEach((Tr, index) => {
            Tr.style.borderLeft = Tr.children[4].textContent?.toLowerCase().trim() == "pendding approval" ? '7px solid #800000' : '7px solid coral'
            if (Tr.children[3].textContent?.toLowerCase().trim() == "shipped") Tr.style.borderLeft = '7px solid green'
    })
}
export function GetDataTableRows() {
    let DisClaimerIsOff = document.getElementById('SearchDisclaimer') == null
    let Rows: HTMLTableRowElement[] = []

    if (DisClaimerIsOff) Rows = Array.from(document.getElementsByClassName('PoRow')) as HTMLTableRowElement[]
    return Rows
}
export function RemoveSlashes(ForTrming: string) {
    return ForTrming.replace(/\\|\//g, "")
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

export function CalculatePageCount(RowCount: number, RowInPage: number) {
    return Math.ceil(RowCount / RowInPage)
}
export function InitPageCountArray(PageCount: number) {
    return Array(PageCount).fill(0).map((x, i) => i)
}
export function ReplaceBackSlashInDate(Date: string) {
    return Date.replace(/\\|\//g, "_")
}
export function GetCurrentDate() {
    let Now = new Date().toLocaleString().replace(",", "_").replace(":", "").replace(":", "");
    return Now.replace(/ /g, "")
}
export function FormatDate(Date: string) {
    return new DatePipe('en-US').transform(Date, 'MM-dd-YYYY') || ""
}


@Injectable({
    providedIn: 'root'
})
export class DIs {
    PoService: POsService;
    spinner: Spinner;
    router: Router;
    notification: NotificationserService;


    constructor(
        private Poservice: POsService,
        private Spinner: Spinner,
        private Router: Router,
        private Notification: NotificationserService
    ) {
        this.PoService = this.Poservice;
        this.spinner = this.Spinner;
        this.router = this.Router;
        this.notification = this.Notification
    }
}

export function FormatUSAAddress(address:string){
    return address.replace(/ *, */g, '\n')
}

