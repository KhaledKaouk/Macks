import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { ServerNotificationService } from './Services/server-notification.service';
import { InDevMode } from './Utilities/Variables';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{
  title = 'Mackdistribution';
  UserName: string = localStorage.getItem('username')?"":"";
  LogStatus: boolean = (localStorage.getItem('token'))? false:true;
  spinner: any;
  constructor(
    private router: Router,
    private serverNotifications: ServerNotificationService,
    ){}
  
  ngOnInit(): void {
   this.HideSpinner();
   this.ChangeProtocolIntoHttps();
   this.serverNotifications.RigesterDeviceForNotifications();
  }

  ChangeProtocolIntoHttps(){
    // if(!InDevMode && location.protocol == 'http:') location.protocol = 'https:' 
  }
  GoToLogIn(){
    this.router.navigateByUrl('/LogIn')
  }
  LogOut(){
    localStorage.clear();
    this.LogStatus = true;
    this.router.navigateByUrl('/LogIn')
  }
  ShowSpinner(){
    this.spinner = document.getElementById('SpinnerContainer');
    if(this.spinner) this.spinner.style.display = "block";  
  }
  HideSpinner(){
    this.spinner = document.getElementById('SpinnerContainer');
    if(this.spinner) this.spinner.style.display = "none";
  }
}
