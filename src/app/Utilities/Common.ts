import { Type } from "@angular/core";
import { Router } from "@angular/router";
import { NgProgressRef } from "ngx-progressbar";
import { type } from "os";
import { getMaxListeners } from "process";
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
    ProgressRef: NgProgressRef,
    router: Router) {

    try {
        const res = await PoService.Uploadfile(FormData, FileName).toPromise();
        if (res == true) {
            return true
        } else {
            ProgressRef.complete()
            Notification.OnError("The File Was Not Uploaded Please Try Again Later")
            return false
        }
    } catch (err) {
        Auth_error_handling(err, ProgressRef, Notification, router)
        return false;
    }
}

export let StaticData: POs[] = [
    {
        id: 1,
        dealerName: "test1",
        dealerEmail: "Example@gmail.com",
        dealerPONumber: "test1",
        mackPONumber: "tse1",
        corinthianPO: "test1",
        itemID: 0,
        supplierName: "test1",
        userID: "test",
        mackPOAttach: "",
        corinthianPOAttach: "",
        shippingDocs: "",
        comments: "setse",
        alfemoComments: "test",
        status: "tseetssetest",
        productionRequestDate: "tsets",
        factoryEstimatedShipDate: "setsetse",
        dateReceived: "tsetsetste",
        factoryEstimatedArrivalDate: "11111111",
        booked: false,
        finalDestLocation: "22222222",
        containerNumber: "333",
        productionRequestTime: "123123",
        approvalStatus: false
    },
    {
        id: 1,
        dealerName: "t222222222222222222222222222222222222222est",
        dealerPONumber: "test",
        dealerEmail: "Example@gmail.com",
        mackPONumber: "tse",
        corinthianPO: "test",
        itemID: 0,
        supplierName: "test",
        userID: "test",
        mackPOAttach: "test",
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
