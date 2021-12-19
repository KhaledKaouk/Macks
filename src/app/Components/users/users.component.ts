import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/Models/User';
import { UserService } from 'src/app/Services/user.service';
import { RemoveSearchDisclaimer, ShowSearchDisclaimer } from 'src/app/Utilities/Common';
import { UpdateUserComponent } from '../update-user/update-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnInit {

  DataOfCurrentPage: User[] = [];
  Users: User[] = [];
  PageCountArray: number[] = [0]
  PagesCount: number = 1;
  DataRowsInPage: number = 15;
  CurrentPage: number = 0;

  constructor(
    private UserService: UserService,
    private MatDialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.GetAllUsers();
  }
  GetAllUsers(){
    this.UserService.GetUsers().then((Users: any) => {
      this.Users = Users;
      this.PagesCount = Math.ceil(this.Users.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0)
    })
  }
  SearchByUserName(event: any){}
  UpdateUser(User: User){
    this.MatDialog.open(UpdateUserComponent,{
      height: '30rem',
      width: '30rem',
      data: User
    })
  }

  NextPage(){
    this.SliceDataForPaginantion(this.CurrentPage + 1)

  }
  PreviousPage(){
    this.SliceDataForPaginantion(this.CurrentPage - 1)

  }
  SliceDataForPaginantion(PageNumber: number,Users?: User[]){
    if(Users) console.log(Users)
    let PortsForSlicing: User[] = this.Users;
    if (Users) PortsForSlicing = Users;
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if (PortsForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage).length >= 1) {
      RemoveSearchDisclaimer();
      this.DataOfCurrentPage = PortsForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage)
      this.CurrentPage = PageNumber;
    }else{
      this.DataOfCurrentPage = [];
      ShowSearchDisclaimer(this.DataOfCurrentPage.length);
    }
  }
}
