import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/Services/auth.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { EventEmitter } from 'stream';
import { HeaderComponent } from '../header/header.component';

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
    private header: HeaderComponent) { }

  ngOnInit(): void {
    if(localStorage.getItem('token')){
      this.router.navigateByUrl('')
    }
  }

  Submit(){
    try{
    this.auth.LogIn(this.LogIn.get('UserName')?.value, this.LogIn.get('Password')?.value).toPromise().then(res => {
        localStorage.setItem("token",res.access_token)
        this.header.UserName = this.LogIn.get('username')?.value;
        this.header.LogStatus = false;
        this.router.navigateByUrl('')
        location.reload();
        this.Notificationser.OnSuccess("Welcome To Mack Distribution")
      },(err:any) => {
        if (err.error == "invalid_grant"){
          this.router.navigateByUrl('/LogIn')
        }else{
          this.Notificationser.OnError('wrong username or password')
        }
      });
    }
    catch{
      this.Notificationser.OnError("wrong username or password")
    }
  }

}
