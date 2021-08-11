import { Injectable, Injector, Type } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { NgProgress, NgProgressRef } from "ngx-progressbar";
import { AppComponent } from "../app.component";
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
    
        const res = await spinner.WrapWithSpinner( PoService.Uploadfile(FormData, FileName).toPromise().then((res :any) =>{
            if (res == true) {
                return true
            } else {
                Notification.OnError("The File Was Not Uploaded Please Try Again Later")
                return false
            }
        },
        (err) => {
       Auth_error_handling(err, Notification, router)
       return false;
        }));
}

export let StaticData: POs[] = [
    {
        id: 1,
        dealerName: "test1",
        dealerEmail: "kaoukyaseenkhaled@gmail.com",
        dealerPONumber: "00 222 2229191",
        mackPONumber: "tse1",
        corinthianPO: "abcd-1234567890",
        itemID: 0,
        supplierName: "test1",
        userID: "test",
        mackPOAttach: "111",
        corinthianPOAttach: "",
        shippingDocs: "",
        comments: "setse",
        alfemoComments: "test",
        status: "tseetssetest",
        productionRequestDate: "08/09/2022",
        factoryEstimatedShipDate: "08/09/2022",
        dateReceived: "08/09/2022",
        factoryEstimatedArrivalDate: "11111111",
        booked: false,
        finalDestLocation: "22222222",
        containerNumber: "333",
        productionRequestTime: "123123",
        approvalStatus: false
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
        approvalStatus: true
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
    Admin: ["Approve","MackPo","ShippingDocs","Reject","CorinthainPo","ApplyChanges","MackUpload"],
    Corinthain: ["ShippingDocs","CorinthainPo","Update","ProductionRequestDate"],
    Alfemo: ["MackPo","Update"]
}

export function OrderPosByDate(Pos: POs[]){
   return Pos.reverse();
}

export type Tools = {
    notifications : NotificationserService,
    progress: NgProgress,
    router: Router,
    dialog: MatDialog

}

export function CapitlizeFirstLater(anyString: string){
    return anyString.replace(anyString[0],anyString[0].toUpperCase())
}
@Injectable({
    providedIn: 'root'
  })
export class Spinner{

    constructor(private app: AppComponent){}

    WrapWithSpinner(Promise: Promise<any>){
        this.app.ShowSpinner();
        Promise.finally(() =>{this.app.HideSpinner();})
    }
}