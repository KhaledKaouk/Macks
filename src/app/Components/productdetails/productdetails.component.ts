import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/Models/Product';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.sass']
})
export class ProductdetailsComponent implements OnInit {

  ProdcutToShow: Product = new Product();
  constructor(@Inject(MAT_DIALOG_DATA) public data: Product ) { }

  ngOnInit(): void {
    this.ProdcutToShow = this.data;
  }

}
