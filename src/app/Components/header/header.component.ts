import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  title = 'Mackdistribution';
  UserName = localStorage.getItem('username')? localStorage.getItem('username'):"";
  LogStatus: boolean = (localStorage.getItem('token'))? false:true;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  LogOut(){
    localStorage.clear();
    this.UserName = ""
    this.LogStatus = true;
    this.router.navigateByUrl('/LogIn')
  }
}
