import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/User';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { UserService } from 'src/app/Services/user.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.sass']
})
export class UpdateUserComponent implements OnInit {

  UpdateUserForm = new FormGroup({
    UserName: new FormControl('',Validators.required),
    Password: new FormControl('',Validators.required),
    ConfirmPassword: new FormControl('',Validators.required),
    Role: new FormControl('',Validators.required)
  })

  UserToUpdate: User = new User();
  UpdatedUser: User = new User();

  constructor(
    private UserService: UserService,
    private NotificationService: NotificationserService,
    private router: Router,
    private dialogref: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
  ) { }

  ngOnInit(): void {
    CheckToken(this.router);
    this.UserToUpdate = this.data;
    this.AssignUserToForm();

  }
  AssignUserToForm(){
    this.UpdateUserForm.setValue({
      UserName: this.data.userName,
      Password: this.data.password,
      ConfirmPassword: this.data.password,
      Role: this.data.Role
    }) 
  }
  AssignFormValuesToUserObject(){
    this.UserToUpdate.userName = this.UpdateUserForm.get('UserName')?.value;
    this.UserToUpdate.password = this.UpdateUserForm.get('Password')?.value;
    this.UserToUpdate.Role = this.UpdateUserForm.get('Role')?.value;
  }
  Submit(){
    this.AssignFormValuesToUserObject();
    if(this.ConfirmPasswordMatch()) this.UserService.UpdateUser(this.UserToUpdate).then((res: any) => {
      this.NotificationService.OnSuccess("You have Successfully updated the user info")
      location.reload()
    },(err: any) => {
      Auth_error_handling(err,this.NotificationService,this.router)
    })
  }
  Close(){
    this.dialogref.close();
  }
  ConfirmPasswordMatch(){
    return this.UpdateUserForm.get('Password')?.value == this.UpdateUserForm.get('ConfirmPassword')?.value
  }

}
