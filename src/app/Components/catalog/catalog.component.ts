import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductdetailsComponent } from '../productdetails/productdetails.component';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.sass']
})
export class CatalogComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  ShowDetails(){
    this.dialog.open(ProductdetailsComponent,{
      width: '800px',
      height: '400px'
    })
  }

}
