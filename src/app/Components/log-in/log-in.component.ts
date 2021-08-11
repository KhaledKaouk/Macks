import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import {  Spinner } from 'src/app/Utilities/Common';
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
    private spinner: Spinner,
    private header: HeaderComponent) { }

  ngOnInit(): void {
      this.Logout();
  }

  Submit(){
    this.spinner.WrapWithSpinner( this.auth.LogIn(this.LogIn.get('UserName')?.value, this.LogIn.get('Password')?.value).toPromise().then(res => {
      
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
      }))
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
