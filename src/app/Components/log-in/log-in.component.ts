import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/Services/auth.service';
import { NotificationserService } from 'src/app/Services/Notificationser.service';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  
  username: string ="";

  LogIn = new FormGroup({
    UserName: new FormControl(''),
    Password: new FormControl('')
  })

  constructor(private auth:AuthService,
    private Notificationser: NotificationserService,
    private router: Router,
    private appcom: AppComponent) { }

  ngOnInit(): void {
  }

  Submit(){
    this.auth.LogIn(this.LogIn.get('UserName')?.value, this.LogIn.get('Password')?.value).toPromise().then(res => {
      try{
        sessionStorage.setItem("token",res.access_token)
        this.appcom.UserName = this.LogIn.get('UserName')?.value;
        this.appcom.LogStatus = false;
        this.router.navigateByUrl('')
        this.Notificationser.OnSuccess("Welcome To Mack Distribution")
      }
      catch{
        this.Notificationser.OnError("wrong username or password")
      }
    });
  }

}
