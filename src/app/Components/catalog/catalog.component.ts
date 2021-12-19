import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { POsService } from 'src/app/Services/pos.service';
import { ProductdetailsComponent } from '../productdetails/productdetails.component';
import { Product } from 'src/app/Models/Product';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { NgProgress } from 'ngx-progressbar';
import { Router } from '@angular/router';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { Spinner } from 'src/app/Utilities/Common';
import { AuthService } from 'src/app/Services/auth.service';
import * as XLSX from 'xlsx';
import { port } from 'src/app/Models/port';
import { PortService } from 'src/app/Services/port.service';
import { Dealers } from 'src/app/Models/Dealers';
import { DealersService } from 'src/app/Services/dealers.service';
import { POs } from 'src/app/Models/Po-model';
import { GetDealerById } from 'src/app/Utilities/DealersHandlers';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.sass']
})
export class CatalogComponent implements OnInit {

  ProductsList: Product[] = [];
  testProduct: Product[] = [{
    id: "",
    itemid: "",
    itemname: "Sofa",
    itemdesc: "this is the finet Sofa in Turkey, nade from oak",
    itempic: "../assets/sample2.jfif",
    itemdescfile: "",
    dimensions: "50  x  75",
    linename: "Alfemo",
    itemtype: "Sofa",
  },
  {
    id: "",
    itemid: "",
    itemname: "Chair",
    itemdesc: "this is the finet Chair in Turkey, nade from oak",
    itempic: "../assets/sample1.jfif",
    itemdescfile: "",
    dimensions: "50  x  75",
    linename: "Alfemo",
    itemtype: "Chair",
  },
  {
    id: "",
    itemid: "",
    itemname: "Table",
    itemdesc: "this is the finet Table in Turkey, nade from oak",
    itempic: "../assets/sample3.jfif",
    itemdescfile: "",
    dimensions: "50  x  75",
    linename: "Alfemo",
    itemtype: "Table",
  }]


  constructor(private dialog: MatDialog,
    private Notification: NotificationserService,
    private router: Router,
    private spinner: Spinner,
    private Poservice: POsService,
    private DealerService: DealersService,
    private authser: AuthService) { }

  ngOnInit(): void {
    this.authser.GetRole();
    this.spinner.WrapWithSpinner( this.Poservice.GetProducts().toPromise().then((res: any) => {
      this.ProductsList = res;
    }, (err: any) => {
      Auth_error_handling(err, this.Notification, this.router)
    }))
  }

  ShowDetails(ProductToShow: Product) {
    this.dialog.open(ProductdetailsComponent, {
      width: '800px',
      height: '400px',
      data: ProductToShow
    })
  }
}
