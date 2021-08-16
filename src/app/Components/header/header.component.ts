import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { AdminComponent } from '../admin/admin.component';
import { AlfemoComponent } from '../alfemo/alfemo.component';
import { MyPosComponent } from '../my-pos/my-pos.component';

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

  
  constructor(private router: Router,
    private AuthSer: AuthService,
    private adminComponent:AdminComponent,
    private CorinthainComponent:MyPosComponent,
    private alfemoComponent:AlfemoComponent
    ) { }

  ngOnInit(): void {
    this.AuthSer.GetRole();
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
  CheckRole() {
    return localStorage.getItem('Role') ;
  }
  FilterPosByCorinthainPo(event:any){
    if(this.CheckRole() == "admin") this.adminComponent.FilterPosByCorinthainPo(event.target.value);
    if(this.CheckRole() == "alfemo") this.CorinthainComponent.FilterPosByCorinthainPo(event.target.value);
    if(this.CheckRole() == "corinthian") this.alfemoComponent.FilterPosByCorinthainPo(event.target.value);

  }
}
