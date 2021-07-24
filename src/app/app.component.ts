import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Mackdistribution';
  UserName: string = localStorage.getItem('username')?"":"";
  LogStatus: boolean = (localStorage.getItem('token'))? false:true;
  constructor(private router: Router){}

  GoToLogIn(){
    this.router.navigateByUrl('/LogIn')
  }
  LogOut(){
    localStorage.clear();
    this.LogStatus = true;
    this.router.navigateByUrl('/LogIn')
  }
}
