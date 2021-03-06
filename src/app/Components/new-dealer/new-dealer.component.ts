import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Dealers } from 'src/app/Models/Dealers';
import { port } from 'src/app/Models/port';
import { DealersService } from 'src/app/Services/dealers.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { PortService } from 'src/app/Services/port.service';
import { Spinner } from 'src/app/Utilities/Common';
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
    DealerAddress: new FormControl(''),
    DealerPort: new FormControl('')
  })

  Loading: boolean = false;
  NewDealer: Dealers = new Dealers();
  Ports: port[] = [];

  constructor(
    private DealerService: DealersService,
    private PortService: PortService,
    private router: Router,
    private spinner: Spinner,
    private Notification: NotificationserService,
    private dialogref: MatDialogRef<NewDealerComponent>) { }

  ngOnInit(): void {
    this.GetAllPorts();
  }

  async GetAllPorts() {
    this.spinner.WrapWithSpinner(this.PortService.GetPorts()
      .then(
        (ports: any) => { this.Ports = ports },
        (err) => Auth_error_handling(err, this.Notification, this.router)
      ))
  }
  async CreateNewDealer() {
    this.AssignFormValuesToDealerObject();

    this.spinner.WrapWithSpinner(this.DealerService.CreateDealer(this.NewDealer).then((res) => {
      this.Notification.OnSuccess("You Have Created a New Dealer Successfully")

      location.reload();
      this.Close();
    }, (err) => {
      DealerWithAuth_error_handling(err, this.Notification, this.router, this.NewDealer)
    }), this.dialogref)

  }

  AssignFormValuesToDealerObject() {
    this.NewDealer.name = this.NewDealerForm.get('DealerName')?.value;
    this.NewDealer.email = this.NewDealerForm.get('DealerEmail')?.value;
    this.NewDealer.mobile = this.NewDealerForm.get('DealerMobile')?.value;
    this.NewDealer.address = this.NewDealerForm.get('DealerAddress')?.value
    this.NewDealer.PortId = this.NewDealerForm.get('DealerPort')?.value
  }

  Close() {
    this.dialogref.close();
  }

}
