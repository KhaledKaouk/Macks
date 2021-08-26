import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Dealers } from 'src/app/Models/Dealers';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { AddNewDealer } from 'src/app/Utilities/DealersCRUD';

@Component({
  selector: 'app-new-dealer',
  templateUrl: './new-dealer.component.html',
  styleUrls: ['./new-dealer.component.sass']
})
export class NewDealerComponent implements OnInit {

  NewDealerForm = new FormGroup({
    DealerName: new FormControl('', Validators.required),
    DealerEmail: new FormControl(''),
  })

  Loading: boolean = false;
  NewDealer: Dealers = new Dealers();
  constructor(
    private Notification: NotificationserService,
    private dialogref: MatDialogRef<NewDealerComponent>) { }

  ngOnInit(): void {
  }

  async CreateNewPo() {
    this.AssignFormValuesToDealerObject();
    this.CreateDealerId();
    await AddNewDealer(this.NewDealer);
    this.Notification.OnSuccess("You Have Created a New Dealer Successfully")
    location.reload();
    this.Close();
  }

  AssignFormValuesToDealerObject() {
    this.NewDealer.DealerName = this.NewDealerForm.get('DealerName')?.value;
    this.NewDealer.Email = this.NewDealerForm.get('DealerEmail')?.value;
  }

  CreateDealerId() {
    this.NewDealer.Id = Math.random().toFixed(6);
  }
  Close() {
    this.dialogref.close();
  }
}
