import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Dealers } from 'src/app/Models/Dealers';
import { port } from 'src/app/Models/port';
import { DealersService } from 'src/app/Services/dealers.service';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { PortService } from 'src/app/Services/port.service';
import { Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling, DealerWithAuth_error_handling } from 'src/app/Utilities/Errorhadling';

@Component({
  selector: 'app-editdealerinformation',
  templateUrl: './editdealerinformation.component.html',
  styleUrls: ['./editdealerinformation.component.sass']
})
export class EditdealerinformationComponent implements OnInit {

  DealerToUpdate: Dealers = new Dealers();
  UpdatedDealer: Dealers = new Dealers();
  Ports: port[] = [];
  Loading: boolean = false;
  DealerForm = new FormGroup({
    DealerName: new FormControl('', Validators.required),
    DealerEmail: new FormControl(''),
    DealerMobile: new FormControl(''),
    DealerAddress: new FormControl(''),
    DealerPort: new FormControl(''),
  })
  constructor(
    private dialogref: MatDialogRef<EditdealerinformationComponent>,
    private router: Router,
    private spinner: Spinner,
    private PortService: PortService,
    private DealerServies: DealersService,
    @Inject(MAT_DIALOG_DATA) public data: Dealers,
    private Notification: NotificationserService) { }

  ngOnInit(): void {
    this.DealerToUpdate = this.data;
    this.GetAllPorts()
    this.AssignDealerInfoToForm();
  }

  async GetAllPorts() {
    await this.PortService.GetPorts()
      .then(
        (ports: any) => { this.Ports = ports },
        (err) => Auth_error_handling(err, this.Notification, this.router))
  }
  async UpdateDealer() {
    this.AssignFormValuesToUpdatedDealer();
    this.spinner.WrapWithSpinner(this.DealerServies.UpdateDealer(this.UpdatedDealer).then((res) => {
      this.Notification.OnSuccess("You have Updated Your Dealer Info Successfully");

      location.reload();
      this.Close();
    }, (err: any) => {
      DealerWithAuth_error_handling(err, this.Notification, this.router, this.UpdatedDealer)
    }), this.dialogref)
  }

  AssignFormValuesToUpdatedDealer() {
    this.UpdatedDealer._id = this.DealerToUpdate._id;
    this.UpdatedDealer.name = this.DealerForm.get('DealerName')?.value;
    this.UpdatedDealer.email = this.DealerForm.get('DealerEmail')?.value;
    this.UpdatedDealer.mobile = this.DealerForm.get('DealerMobile')?.value;
    this.UpdatedDealer.address = this.DealerForm.get('DealerAddress')?.value;
    this.UpdatedDealer.PortId = this.DealerForm.get('DealerPort')?.value;
  }
  AssignDealerInfoToForm() {
    this.DealerForm.setValue({
      DealerName: this.DealerToUpdate.name,
      DealerEmail: this.DealerToUpdate.email,
      DealerMobile: this.DealerToUpdate.mobile,
      DealerAddress: this.DealerToUpdate.address,
      DealerPort: this.DealerToUpdate.PortId || ""
    })
  }
  Close() {
    this.dialogref.close();
  }
}
