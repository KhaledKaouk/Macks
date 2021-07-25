import { Router } from "@angular/router";
import { NgProgressRef } from "ngx-progressbar";
import { NotificationserService } from "../Services/notificationser.service";



export function Auth_error_handling(err:any,progressRef: NgProgressRef,Notification: NotificationserService, router: Router):void{
    if (err.error.message == "Authorization has been denied for this request."){
        progressRef.complete()
        localStorage.clear();
        router.navigateByUrl('/LogIn')
      }else{
        progressRef.complete()
        Notification.OnError('try again later or login again')
      }
}