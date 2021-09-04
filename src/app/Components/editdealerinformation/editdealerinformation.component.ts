import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Dealers } from 'src/app/Models/Dealers';
import { DealersService } from 'src/app/Services/dealers.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { Spinner, CheckDealersForDuplicate } from 'src/app/Utilities/Common';
import { Auth_error_handling, DealerWithAuth_error_handling } from 'src/app/Utilities/Errorhadling';

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
    DealerName: new FormControl('', Validators.required),
    DealerEmail: new FormControl(''),
    DealerMobile: new FormControl(''),
    DealerAddress: new FormControl('')
  })
  constructor(
    private dialogref: MatDialogRef<EditdealerinformationComponent>,
    private router: Router,
    private spinner: Spinner,
    private DealerServies: DealersService,
    @Inject(MAT_DIALOG_DATA) public data: Dealers,
    private Notification: NotificationserService) { }

  ngOnInit(): void {
    this.DealerToUpdate = this.data;
    this.AssignDealerInfoToForm();
  }

  async UpdateDealer() {
    this.AssignFormValuesToUpdatedDealer();
    // if (!CheckDealersForDuplicate(this.UpdatedDealer, this.DealerServies)) {
      this.spinner.WrapWithSpinner(this.DealerServies.UpdateDealer(this.UpdatedDealer).then((res) => {
        // if (res == true) {
          this.Notification.OnSuccess("You have Updated Your Dealer Info Successfully");
        // } else {
        //   this.Notification.OnError("The Dealer " + this.UpdatedDealer.name + " Already exists")
        // }
        location.reload();
        this.Close();
      }, (err: any) => {
        DealerWithAuth_error_handling(err, this.Notification, this.router,this.UpdatedDealer)
      }), this.dialogref)
    // } else {
    //   this.Notification.OnError("The Dealer " + this.UpdatedDealer.name + " Already exists")
    // }
  }

  AssignFormValuesToUpdatedDealer() {
    this.UpdatedDealer.id = this.DealerToUpdate.id;
    this.UpdatedDealer.name = this.DealerForm.get('DealerName')?.value;
    this.UpdatedDealer.email = this.DealerForm.get('DealerEmail')?.value;
    this.UpdatedDealer.mobile = this.DealerForm.get('DealerMobile')?.value;
    this.UpdatedDealer.address = this.DealerForm.get('DealerAddress')?.value;
  }
  AssignDealerInfoToForm() {
    this.DealerForm.setValue({
      DealerName: this.DealerToUpdate.name,
      DealerEmail: this.DealerToUpdate.email,
      DealerMobile: this.DealerToUpdate.mobile,
      DealerAddress: this.DealerToUpdate.address
    })
  }
  Close() {
    this.dialogref.close();
  }
}
