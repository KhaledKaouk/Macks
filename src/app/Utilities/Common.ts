import { Router } from "@angular/router";
import { NgProgressRef } from "ngx-progressbar";
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

        try{
            const res = await PoService.Uploadfile(FormData, FileName).toPromise();
            if (res == true) {
                return true
            } else {
                ProgressRef.complete()
                Notification.OnError("The File Was Not Uploaded Please Try Again Later")
                return false
            }
        }catch(err){
            Auth_error_handling(err,ProgressRef,Notification,router)
            return false;
        }
    }


