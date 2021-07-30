import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgProgress } from 'ngx-progressbar';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/Services/auth.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { ProgrssBar } from 'src/app/Utilities/Common';
import { EventEmitter } from 'stream';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  
  username: string ="";
  progressRef: any;

  LogIn = new FormGroup({
    UserName: new FormControl(''),
    Password: new FormControl('')
  })

  constructor(private auth:AuthService,
    private Notificationser: NotificationserService,
    private router: Router,
    private progress:NgProgress,
    private header: HeaderComponent) { }

  ngOnInit(): void {
      this.Logout();
    
    this.progressRef = this.progress.ref('myProgress');
  }

  Submit(){
    ProgrssBar( this.auth.LogIn(this.LogIn.get('UserName')?.value, this.LogIn.get('Password')?.value).toPromise().then(res => {
      
        this.SaveUserNameAndTokenToLocalStorage(this.LogIn.get('UserName')?.value,res.access_token)
        this.SetUserNameAndLogStatusToHeader();
      
        this.Notificationser.OnSuccess("Hello "+ this.header.UserName+" Welcome To Mack Distribution")
      
        this.router.navigateByUrl('')
      
      },(err:any) => {
        if (err.error == "invalid_grant"){
          this.router.navigateByUrl('/LogIn')
        }else{
          this.Notificationser.OnError('wrong username or password')
        }
      }),this.progressRef)
  }

  SaveUserNameAndTokenToLocalStorage(username:string,token:any){
    localStorage.setItem("token",token);
    localStorage.setItem("username",username)
  }
  
  SetUserNameAndLogStatusToHeader(){
    this.header.SetUserName()
    this.header.Logged();
  }
  Logout(){
    localStorage.clear();
    this.header.Logged();
    this.header.SetUserName()
  }
}
