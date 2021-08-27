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

export function AddPreffixAndExtention(Preffix: string, FileNameBody: string, GetExtentionFrom: string) {
    let extenstion: string = GetExtentionFrom;
    extenstion = extenstion.substring(extenstion.lastIndexOf('.'));

    let AdjustedFileName: string = Preffix + FileNameBody + extenstion;

    return AdjustedFileName;
}

export async function UploadFile(
    PoService: POsService,
    FormData: FormData,
    FileName: string,
    Notification: NotificationserService,
    spinner: Spinner,
    router: Router) {

    let result: boolean = true;
    spinner.ShowSpinner();
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
        }).finally(() => { spinner.HideSppiner() });
    return result
}

export let StaticData: POs[] = [
    {
        id: 1,
        dealerName: "",
        dealerEmail: "kaoukyaseenkhaled@gmail.com",
        dealerPONumber: "00 222 2229191",
        mackPONumber: "tse1",
        corinthianPO: "abcd-1234567890",
        itemID: 0,
        supplierName: "test1",
        userID: "",
        mackPOAttach: "111",
        corinthianPOAttach: "",
        shippingDocs: "",
        comments: "tnaklsjfh;a iosjc;klasjd;k lasmdklaslknmdalsjdfasklnmc as;klndalksdnas;kldnas;kl  na;lksdaklsdm  aklsd klasdn;lqwknmd lksand;lkas mdlasknd klsmd klasnmd klasd lkmaskl mdla's mest",
        alfemoComments: "tnaklsjfh;aios jc;klasjd;kla mdklaslknmdalsjdfask nmcas;klndalk sdnas;kldnas;kl na;lksdaklsdm  aklsd klasdn;lqwknmd lksand;lkas mdlasknd klsmd klasnmd klasd lkmaskl mdla's mest",
        status: "tseetssetest",
        productionRequestDate: "08/09/2022",
        factoryEstimatedShipDate: "08/09/2022",
        dateReceived: "08/09/2022",
        factoryEstimatedArrivalDate: "11111111",
        booked: false,
        finalDestLocation: "22222222",
        containerNumber: "333",
        productionRequestTime: "123123",
        approvalStatus: false,
        deleted: false
    },
    {
        id: 1,
        dealerName: "abcd-1234567890",
        dealerPONumber: "test",
        dealerEmail: "Example@gmail.com",
        mackPONumber: "tse",
        corinthianPO: "test",
        itemID: 0,
        supplierName: "test",
        userID: "test",
        mackPOAttach: "123",
        corinthianPOAttach: "1",
        shippingDocs: "stst",
        comments: "setse",
        alfemoComments: "test",
        status: "tseetssetest",
        productionRequestDate: "1950-08-06T00:00:00",
        factoryEstimatedShipDate: "1950-08-06T00:00:00",
        dateReceived: "tsetsetste",
        factoryEstimatedArrivalDate: "1950-08-06T00:00:00",
        booked: false,
        finalDestLocation: "22222222",
        containerNumber: "333",
        productionRequestTime: "123123",
        approvalStatus: true,
        deleted: false
    }
];

export let FrightPricesStaticData: frightPrices[] = [{
    id: 1,
    locations: "nY",
    currentprice: 125,
    oldprice: 100,
    changedon: "1998-2-12"

}]

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
    Admin: ["Approve", "MackPo", "ShippingDocs", "Reject", "CorinthainPo", "ApplyChanges", "MackUpload","Delete"],
    Corinthain: ["ShippingDocs", "CorinthainPo", "Update", "ProductionRequestDate"],
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
export function FilterPosBy(ListOfPos: POs[], CorinthianPo?: string,
    DealerName?: string,
    MackPo?: string,
    Status?: string,
    productionRequestDate?: string,
    factoryEstimatedShipDate?: string,
    factoryEstimatedArrivalDate?: string,
    containerNumber?: string,
    ApprovalStatus?: boolean) {
    if (CorinthianPo) return ListOfPos.filter(Po => Po.corinthianPO.includes(CorinthianPo))
    if (DealerName) return ListOfPos.filter(Po => Po.corinthianPO == CorinthianPo)
    if (MackPo) return ListOfPos.filter(Po => Po.mackPONumber == MackPo)
    if (Status) return ListOfPos.filter(Po => Po.status == Status)
    if (productionRequestDate) return ListOfPos.filter(Po => Po.productionRequestDate == productionRequestDate)
    if (factoryEstimatedShipDate) return ListOfPos.filter(Po => Po.factoryEstimatedShipDate == factoryEstimatedShipDate)
    if (factoryEstimatedArrivalDate) return ListOfPos.filter(Po => Po.factoryEstimatedArrivalDate == factoryEstimatedArrivalDate)
    if (containerNumber) return ListOfPos.filter(Po => Po.containerNumber == containerNumber)
    if (ApprovalStatus) return ListOfPos.filter(Po => Po.approvalStatus == ApprovalStatus)

    return ListOfPos;
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
export let InDevMode =  localStorage.getItem('DevMode')?.toLowerCase() === "true" ? true : false 

export function FilterDealersByName(ListOfDealers: Dealers[],DealerName: string){
    return ListOfDealers.filter(Dealer => Dealer.name.toLowerCase().includes(DealerName.toLowerCase()))
}

export function ColorTR() {
    Array.from(document.getElementsByTagName('tr')).forEach((Tr, index) => {
      if (index != 0) {
        if(Tr.children[4].textContent?.toLowerCase().trim() == "pendding approval") Tr.style.borderLeft = '7px solid #800000'
        if(Tr.children[4].textContent?.toLowerCase().trim() == "approved") Tr.style.borderLeft = '7px solid coral'
        if(Tr.children[3].textContent?.toLowerCase().trim() == "shipped") Tr.style.borderLeft = '7px solid green'
      }
    })
  }

