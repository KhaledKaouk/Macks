import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-production-dates',
  templateUrl: './update-production-dates.component.html',
  styleUrls: ['./update-production-dates.component.sass']
})
export class UpdateProductionDatesComponent implements OnInit {

  ProductionDatesForm  = new FormGroup({
    ProductionStartDate: new FormControl('',Validators.required),
    ProductionFinishDate: new FormControl('',Validators.required),
  })
  constructor(private dialogref: MatDialogRef<UpdateProductionDatesComponent>,) { }

  ngOnInit(): void {
  }
  Submit(){
    this.dialogref.close({Dates: this.ProductionDatesForm})
  }
}
