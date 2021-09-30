import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { port } from 'src/app/Models/port';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { PortService } from 'src/app/Services/port.service';
import { Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';

@Component({
  selector: 'app-new-port',
  templateUrl: './new-port.component.html',
  styleUrls: ['./new-port.component.sass']
})
export class NewPortComponent implements OnInit {

  NewPortForm = new FormGroup({
    PortName: new FormControl('',Validators.required),
    City: new FormControl('',Validators.required)
  })

  NewPort: port = new port();
  constructor(private PortService: PortService,
    private dialogref: MatDialogRef<NewPortComponent>,
    private spinner: Spinner,
    private notificationservice: NotificationserService,
    private router: Router) { }

  ngOnInit(): void {
  }

  Submit(){
    this.AssignFormValuesToPortObject();
    this.spinner.WrapWithSpinner(this.PortService.CreatePort(this.NewPort).then((res:any) => {
      this.notificationservice.OnSuccess('You Have Created a New Port Successfully')
      this.Close();
    },(err) => {
      Auth_error_handling(err,this.notificationservice,this.router)
    }),this.dialogref) 
  }
  Close(){
    this.dialogref.close();
  }

  AssignFormValuesToPortObject(){
    this.NewPort.portName =  this.NewPortForm.get('PortName')?.value
    this.NewPort.city =  this.NewPortForm.get('City')?.value
  }

}
