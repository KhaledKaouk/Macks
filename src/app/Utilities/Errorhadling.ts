import { Router } from "@angular/router";
import { NgProgressRef } from "ngx-progressbar";
import { Dealers } from "../Models/Dealers";
import { NotificationserService } from "../Services/notificationser.service";
import { Spinner } from "./Common";



export function Auth_error_handling(err: any, Notification: NotificationserService, router: Router): void {
  if (err.error.message == "Authorization has been denied for this request.") {
    router.navigateByUrl('/LogIn')
  } else {
    Notification.OnError('try again later ' + err.error.message)
  }
}
export function DealerWithAuth_error_handling(err: any, Notification: NotificationserService, router: Router,Delaer:Dealers): void {
  if (err.error.message == "Authorization has been denied for this request.") {
    router.navigateByUrl('/LogIn')
  } else {
    Notification.OnError("the Dealer: " + Delaer.name + "Already exist")
  }
}