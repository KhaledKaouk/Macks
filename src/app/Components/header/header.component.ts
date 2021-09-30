import { Component, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { CheckCorinthianUserPermissions } from 'src/app/Utilities/Common';
import { AdminComponent } from '../admin/admin.component';
import { AlfemoComponent } from '../alfemo/alfemo.component';
import { CreateFeightPriceComponent } from '../create-feight-price/create-feight-price.component';
import { MyPosComponent } from '../my-pos/my-pos.component';
import { NewDealerComponent } from '../new-dealer/new-dealer.component';
import { NewPortComponent } from '../new-port/new-port.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  title = 'Mackdistribution';
  UserName = localStorage.getItem('username') ? localStorage.getItem('username') : "";
  LogStatus: boolean = (localStorage.getItem('token')) ? false : true;
  spinner = document.getElementById('Spinner');
  spinnerstatus: boolean = false;
  UserIsAllowed = CheckCorinthianUserPermissions();


  constructor(private router: Router,
    private AuthSer: AuthService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.AuthSer.GetRole();
    // if(localStorage.getItem('Role') === "corinthian"){ localStorage.setItem('Role',"alfemo"),console.log(localStorage.getItem('Role'))}

  }
  LogOut() {
    this.router.navigateByUrl('/LogIn')
  }

  Logged() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false
    }
  }

  SetUserName() {
    this.UserName = localStorage.getItem('username');
    return this.UserName;
  }
  CheckRole() {
    return localStorage.getItem('Role');
  }
  CheckIfHolley() {
    return CheckCorinthianUserPermissions();
  }
  OperNewDealerForm() {
    this.dialog.open(NewDealerComponent, {
      height: '30rem',
      width: '55rem',
    })
  }
  OpenNewFreightPriceForm(){
    this.dialog.open(CreateFeightPriceComponent,{
      height: '30rem',
      width: '55rem',
    })
  }
  OpenNewPort(){
    this.dialog.open(NewPortComponent, {
      height: '30rem',
      width: '30rem',
    })
  }
}
