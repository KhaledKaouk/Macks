import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductShippingDetails } from 'src/app/Models/CommercialInvoice';

@Component({
  selector: 'app-prdouct-shipping-details',
  templateUrl: './prdouct-shipping-details.component.html',
  styleUrls: ['./prdouct-shipping-details.component.sass']
})
export class PrdouctShippingDetailsComponent implements OnInit {

  PS_DetailsForm = new FormGroup({
    NO: new FormControl(),
    PRODUCT_CODE: new FormControl({value:'',disabled: true}),
    PRODUCT: new FormControl({value:'',disabled: true}),
    Po: new FormControl({value:'',disabled: true}),
    QTY: new FormControl({value:'',disabled: true}),
    PACKS: new FormControl(),
    TOTAL_PACKS: new FormControl({value:'',disabled: true}),
    UNIT_KG: new FormControl(),
    TOTAL_KG: new FormControl({value:'',disabled: true}),
    UNIT_CUBM: new FormControl(),
    TOTAL_CUBM: new FormControl({value:'',disabled: true}),
    UNIT_PRICE: new FormControl(),
    TOTAL_PRICE: new FormControl({value:'',disabled: true}),
  })
  constructor(private dialogref: MatDialogRef<PrdouctShippingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public PS_Details: ProductShippingDetails) { }

  ngOnInit(): void {
    this.AssignPS_DetailsToForm()
  }
  Submit() {
    this.AssignformValuesToPS_Details();
    this.CalculateTotals();
    this.dialogref.close({data: this.PS_Details});
  }
  AssignformValuesToPS_Details(){
    this.PS_Details = this.PS_DetailsForm.getRawValue()
  }
  AssignPS_DetailsToForm() {

    this.PS_DetailsForm.setValue({
      NO: this.PS_Details.NO,
      PRODUCT_CODE: this.PS_Details.PRODUCT_CODE,
      PRODUCT: this.PS_Details.PRODUCT,
      Po: this.PS_Details.Po,
      QTY: this.PS_Details.QTY,
      PACKS: this.PS_Details.PACKS,
      TOTAL_PACKS: this.PS_Details.TOTAL_PACKS,
      UNIT_KG: this.PS_Details.UNIT_KG,
      TOTAL_KG: this.PS_Details.TOTAL_KG,
      UNIT_CUBM: this.PS_Details.UNIT_CUBM,
      TOTAL_CUBM: this.PS_Details.TOTAL_CUBM,
      UNIT_PRICE: this.PS_Details.UNIT_PRICE,
      TOTAL_PRICE: this.PS_Details.TOTAL_PRICE
    })
  }
  CalculateTotals(){
    this.PS_Details.TOTAL_PACKS = this.PS_Details.QTY * this.PS_Details.PACKS;
    this.PS_Details.TOTAL_KG = this.PS_Details.QTY * this.PS_Details.UNIT_KG;
    this.PS_Details.TOTAL_CUBM = this.PS_Details.QTY * this.PS_Details.UNIT_CUBM;
    this.PS_Details.TOTAL_PRICE = this.PS_Details.QTY * this.PS_Details.UNIT_PRICE
}

}
