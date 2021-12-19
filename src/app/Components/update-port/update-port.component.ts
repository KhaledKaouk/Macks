import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { port } from 'src/app/Models/port';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { PortService } from 'src/app/Services/port.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import { Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';

@Component({
  selector: 'app-update-port',
  templateUrl: './update-port.component.html',
  styleUrls: ['./update-port.component.sass']
})
export class UpdatePortComponent implements OnInit {

  UpdatePortForm =  new FormGroup({
    PortName: new FormControl('',Validators.required),
    City: new FormControl('',Validators.required)
  })
  PortToUpdate: port = new port();
  UpdatedPort: port = new port();

  constructor(private PortService: PortService,
    private NotificationService: NotificationserService,
    private router: Router,
    private spinner: Spinner,
    private dialogref: MatDialogRef<UpdatePortComponent>,
    @Inject(MAT_DIALOG_DATA) public data: port) { }

  ngOnInit(): void {
    CheckToken(this.router);
    this.PortToUpdate  = this.data;
    this.AssignPortToUpdateToForm();

  }

  Submit(){
    this.AssignFormValuesToUpdatedPo();
    this.spinner.WrapWithSpinner(this.PortService.UpdatePort(this.UpdatedPort).then((res: any) => {
      this.NotificationService.OnSuccess('You Have Updated The Port Successfully')
      this.Close();
    },(err) => {
      Auth_error_handling(err,this.NotificationService,this.router)
    }),this.dialogref)
  }
  Close(){
    this.dialogref.close();
  }

  AssignFormValuesToUpdatedPo(){
    this.UpdatedPort._id = this.PortToUpdate._id
    this.UpdatedPort.portName =  this.UpdatePortForm.get('PortName')?.value
    this.UpdatedPort.city =  this.UpdatePortForm.get('City')?.value
  }

  AssignPortToUpdateToForm(){
    this.UpdatePortForm.setValue  ({
      PortName : this.PortToUpdate.portName,
      City: this.PortToUpdate.city
    })
  }

}
