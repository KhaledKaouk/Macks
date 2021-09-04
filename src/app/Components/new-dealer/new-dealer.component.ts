import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Dealers } from 'src/app/Models/Dealers';
import { DealersService } from 'src/app/Services/dealers.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { CheckDealersForDuplicate, Spinner } from 'src/app/Utilities/Common';
import { AddNewDealer } from 'src/app/Utilities/DealersCRUD';
import { Auth_error_handling, DealerWithAuth_error_handling } from 'src/app/Utilities/Errorhadling';

@Component({
  selector: 'app-new-dealer',
  templateUrl: './new-dealer.component.html',
  styleUrls: ['./new-dealer.component.sass']
})
export class NewDealerComponent implements OnInit {

  NewDealerForm = new FormGroup({
    DealerName: new FormControl('', Validators.required),
    DealerEmail: new FormControl(''),
    DealerMobile: new FormControl(''),
    DealerAddress: new FormControl('')
  })

  Loading: boolean = false;
  NewDealer: Dealers = new Dealers();
  constructor(
    private DealerService: DealersService,
    private router: Router,
    private spinner: Spinner,
    private Notification: NotificationserService,
    private dialogref: MatDialogRef<NewDealerComponent>) { }

  ngOnInit(): void {
  }

  async CreateNewDealer() {
    this.AssignFormValuesToDealerObject();

    // if (!CheckDealersForDuplicate(this.NewDealer,this.DealerService)) {
      this.spinner.WrapWithSpinner(this.DealerService.CreateDealer(this.NewDealer).then((res) => {
        // if(res == true){
          this.Notification.OnSuccess("You Have Created a New Dealer Successfully")  
        // }else{
        //   this.Notification.OnError("The Dealer " + this.NewDealer.name + " Already exists")
        // }
        location.reload();
        this.Close();
      },(err) => {
        DealerWithAuth_error_handling(err, this.Notification, this.router,this.NewDealer)
      }), this.dialogref)
    // }else{
    //   this.Notification.OnError("The Dealer " + this.NewDealer.name + " Already exists")
    // }
  }

  AssignFormValuesToDealerObject() {
    this.NewDealer.name = this.NewDealerForm.get('DealerName')?.value;
    this.NewDealer.email = this.NewDealerForm.get('DealerEmail')?.value;
    this.NewDealer.mobile = this.NewDealerForm.get('DealerMobile')?.value;
    this.NewDealer.address = this.NewDealerForm.get('DealerAddress')?.value
  }

  Close() {
    this.dialogref.close();
  }
  
}
