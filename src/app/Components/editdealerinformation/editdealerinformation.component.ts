import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dealers } from 'src/app/Models/Dealers';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { UpdateDealer } from 'src/app/Utilities/DealersCRUD';

@Component({
  selector: 'app-editdealerinformation',
  templateUrl: './editdealerinformation.component.html',
  styleUrls: ['./editdealerinformation.component.sass']
})
export class EditdealerinformationComponent implements OnInit {

  DealerToUpdate: Dealers = new Dealers();
  UpdatedDealer: Dealers = new Dealers();
  Loading: boolean = false;
  DealerForm = new FormGroup({
    DealerName: new FormControl('',Validators.required),
    DealerEmail: new FormControl(''),
    DealerMobile: new FormControl(''),
    DealerAddress: new FormControl('')
  })
  constructor(
    private dialogref: MatDialogRef<EditdealerinformationComponent>,
    @Inject (MAT_DIALOG_DATA) public data: Dealers,
    private Notification: NotificationserService) { }

  ngOnInit(): void {
    this.DealerToUpdate = this.data;
    this.AssignObjectToForm();
  }
  async UpdateDealer(){
    this.UpdatedDealer.Id = this.DealerToUpdate.Id;
    this.UpdatedDealer.name =  this.DealerForm.get('DealerName')?.value;
    this.UpdatedDealer.email = this.DealerForm.get('DealerEmail')?.value;
    this.UpdatedDealer.mobile = this.DealerForm.get('DealerMobile')?.value;
    this.UpdatedDealer.address = this.DealerForm.get('DealerAddress')?.value;
    await UpdateDealer(this.UpdatedDealer);
    this.Notification.OnSuccess("You have Updated Your Dealer Info Successfully");
    location.reload();
    this.Close();
  }

  AssignObjectToForm(){
    this.DealerForm.setValue({
      DealerName: this.DealerToUpdate.name,
      DealerEmail: this.DealerToUpdate.email,
      DealerMobile: this.DealerToUpdate.mobile,
      DealerAddress: this.DealerToUpdate.address
    })
  }
  Close(){
    this.dialogref.close();
  }

}
