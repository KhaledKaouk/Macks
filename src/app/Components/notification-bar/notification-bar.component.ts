import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Log } from 'src/app/Models/Log';
import { User } from 'src/app/Models/User';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { ServerNotificationService } from 'src/app/Services/server-notification.service';
import { UserService } from 'src/app/Services/user.service';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.sass']
})
export class NotificationBarComponent implements OnInit {

  Users: User[] = [];
  Notifications: Log[] = []
  constructor(
    private serverNotification: ServerNotificationService,
    private UserService: UserService,
    private NotificationService: NotificationserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.PrepareDataForDisplay();
  }
  async PrepareDataForDisplay() {
    await this.GetNotifications();
    await this.GetUsers();
  }
  async GetNotifications() {
    this.Notifications = await this.serverNotification.GetNotifications()
  }
  async GetUsers() {
    this.UserService.GetUsers()
      .then(
        (users: any) => this.Users = users,
        err => Auth_error_handling(err, this.NotificationService, this.router))
  }

  GetUserName(userId: string) {
    return this.Users.find(user => user._id == userId)?.userName
  }

}
