import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationserService {


  constructor(private notification: NotificationsService) { }

  OnSuccess(massage: string){
    this.notification.success("Success",massage, {
      position: ["top", "right"],
      timeOut: 3000,
      animate: 'fade',
      showProgressBar: true,
    });
  }

  OnError(massage: string){
    this.notification.error("Error",massage, {
      position: ["top","right"],
      timeOut: 3000,
      animate: 'fade',
      showProgressBar: true,
    });
  }

  DisplayInfo(massage:string){
    this.notification.info("Info",massage, {
      position: ["top","right"],
      timeOut: 6000,
      animate: 'fade',
      showProgressBar: true,
    });
  }
}
