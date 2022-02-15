import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { EndPoint } from '../Models/EndPoint';
import { Log } from '../Models/Log';
import { Auth_error_handling } from '../Utilities/Errorhadling';
import { APIURL } from '../Utilities/Variables';
import { NotificationserService } from './notificationser.service';

@Injectable({
  providedIn: 'root'
})
export class ServerNotificationService {

  Route: string = "Notification"

  constructor(
    private http: HttpClient,
    private Notificationservice: NotificationserService,
    private router: Router,
    private swPush: SwPush,

  ) { }

  async GetPublicKey() {
    let PublicKey: string = "";
    await this.http.get(APIURL + this.Route + '/GetServiceWorkerPublicKey').toPromise()
      .then(
        (publickey: any) => PublicKey = publickey,
        err => Auth_error_handling(err, this.Notificationservice, this.router)
      )
    return PublicKey;
  }
  async PostEndPoint(NewEndPoint: EndPoint) {
    await this.http.post(APIURL + this.Route + '/NewEndPoint', NewEndPoint).toPromise()
      .then(
        res => { },
        err => Auth_error_handling(err, this.Notificationservice, this.router)
      )
  }
  async RigesterDeviceForNotifications() {
    let endpoint: EndPoint
    if (this.swPush.isEnabled) this.swPush.requestSubscription({
      serverPublicKey: await this.GetPublicKey(),
    })
      .then(
        DeviceInfo => {
          endpoint = JSON.parse(JSON.stringify(DeviceInfo));
          this.PostEndPoint(endpoint)
        },
        err => Auth_error_handling(err, this.Notificationservice, this.router))
  }
  async GetNotifications() {
    let Notifications: Log[] = []
    await this.http.get(APIURL + 'Log/GetLog').toPromise()
      .then(
        (Logs: any) => Notifications = Logs,
        err => Auth_error_handling(err, this.Notificationservice, this.router)
      )
      return Notifications
  }
}