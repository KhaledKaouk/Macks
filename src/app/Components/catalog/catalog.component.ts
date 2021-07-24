import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { POsService } from 'src/app/Services/pos.service';
import { ProductdetailsComponent } from '../productdetails/productdetails.component';
import { Product } from 'src/app/Models/Product';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { NgProgress } from 'ngx-progressbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.sass']
})
export class CatalogComponent implements OnInit {

  ProductsList: Product[] =  [];
  testProduct: Product[]  =[{
        id:"",
        itemid : "",
        itemname : "Sofa",
        itemdesc : "this is the finet Sofa in Turkey, nade from oak",
        itempic : "../assets/sample2.jpg",
        itemdescfile : "",
        dimensions : "50  x  75",
        linename : "Alfemo",
        itemtype : "Sofa",
  },
  {
    id:"",
    itemid : "",
    itemname : "Chair",
    itemdesc : "this is the finet Chair in Turkey, nade from oak",
    itempic : "../assets/sample1.jpg",
    itemdescfile : "",
    dimensions : "50  x  75",
    linename : "Alfemo",
    itemtype : "Chair",
},
{
  id:"",
  itemid : "",
  itemname : "Table",
  itemdesc : "this is the finet Table in Turkey, nade from oak",
  itempic : "../assets/sample3.jpg",
  itemdescfile : "",
  dimensions : "50  x  75",
  linename : "Alfemo",
  itemtype : "Table",
}]

  progressRef: any;

  constructor(private dialog: MatDialog,
    private Notification:NotificationserService,
    private progress:NgProgress,
    private router: Router,
    private Poservice: POsService) { }

  ngOnInit(): void {
    this.progressRef = this.progress.ref('myProgress');
    this.progressRef.start();
    this.ProductsList = this.testProduct;
    this.Poservice.GetProducts().toPromise().then((res: any) =>{
      this.ProductsList = res;
      this.progressRef.complete();

    },(err:any) => {
      if (err.error.message == "Authorization has been denied for this request."){
        this.progressRef.complete();
        localStorage.clear();
        this.router.navigateByUrl('/LogIn')
      }else{
        this.progressRef.complete();
        this.Notification.OnError('try again later or login again')
      }
    } )
  }

  ShowDetails(ProductToShow: Product){
    this.dialog.open(ProductdetailsComponent,{
      width: '800px',
      height: '400px',
      data: ProductToShow
    })
  }

}
