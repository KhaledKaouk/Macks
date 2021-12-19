import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/User';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { UserService } from 'src/app/Services/user.service';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.sass']
})
export class CreateUserComponent implements OnInit {

  NewUserForm = new FormGroup({
    UserName: new FormControl('',Validators.required),
    Password: new FormControl('',Validators.required),
    ConfirmPassword: new FormControl('',Validators.required),
    Role: new FormControl('',Validators.required)
  })

  NewUser: User = new User();

  constructor(
    private dialogref: MatDialogRef<CreateUserComponent>,
    private UserService: UserService,
    private NotificationService: NotificationserService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  ConfirmPasswordMatch(){
    return this.NewUserForm.get('Password')?.value == this.NewUserForm.get('ConfirmPassword')?.value
  }
  Submit(){
    if(this.ConfirmPasswordMatch()){
      this.AssignFormValuesToUserObject();
       this.UserService.CreateUser(this.NewUser).then((res:any) => {
      this.NotificationService.OnSuccess('you have Successfully created a new user')
    },(err: any) => {
      Auth_error_handling(err,this.NotificationService,this.router)
    })
    location.reload()
    this.dialogref.close();
  }
  }
  AssignFormValuesToUserObject(){
    this.NewUser.userName =  this.NewUserForm.get('UserName')?.value
    this.NewUser.password = this.NewUserForm.get('Password')?.value
    this.NewUser.Role = this.NewUserForm.get('Role')?.value
  }
  Close(){
    this.dialogref.close();
  }
}
