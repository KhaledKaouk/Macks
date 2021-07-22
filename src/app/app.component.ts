import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Mackdistribution';
  UserName: string = sessionStorage.getItem('username')?"":"";
  LogStatus: boolean = (sessionStorage.getItem('token'))? false:true;
  constructor(private router: Router){}

  GoToLogIn(){
    this.router.navigateByUrl('/LogIn')
  }
  LogOut(){
    sessionStorage.clear();
    this.LogStatus = true;
    this.router.navigateByUrl('/LogIn')
  }
}
