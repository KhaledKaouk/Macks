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
  spinner = document.getElementById('Spinner'); 
  spinnerstatus: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }
  LogOut(){
    this.router.navigateByUrl('/LogIn')
  }

  Logged(){
    if(localStorage.getItem('token')){
      return true;
    }else{
      return false
    }
  }

  SetUserName(){
     this.UserName =  localStorage.getItem('username');
     return this.UserName;
  }
  ShowSpinner(){
    if(this.spinner) this.spinner.style.display = "block";  
  }
  HideSpinner(){
    if(this.spinner) this.spinner.style.display = "none";
  }
}
