import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { POsService } from 'src/app/Services/pos.service';
import { ProductdetailsComponent } from '../productdetails/productdetails.component';
import { Product } from 'src/app/Models/Product';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { Router } from '@angular/router';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { Spinner } from 'src/app/Utilities/Common';
import { AuthService } from 'src/app/Services/auth.service';
import { DealersService } from 'src/app/Services/dealers.service';
import { ProductService } from 'src/app/Services/product.service';
import { InDevMode } from 'src/app/Utilities/Variables';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.sass']
})
export class CatalogComponent implements OnInit {

  ProductsList: Product[] = [];
  AllProducts: Product[] = [];
  ProductChildren: Product[] = [];
  ProductDetails: string = '';
  ChildProductOnDisplay: string = '';
  constructor(private dialog: MatDialog,
    private Notification: NotificationserService,
    private router: Router,
    private spinner: Spinner,
    private Poservice: POsService,
    private ProductService: ProductService,
    private DealerService: DealersService,
    private authser: AuthService) { }

  ngOnInit(): void {
    this.authser.GetRole();
    this.GetProducts(); 
  }
  GetProducts(){
    this.spinner.WrapWithSpinner( this.ProductService.GetProducts().then((res: any) => {
      this.AllProducts = res;
      this.ProductsList = this.GetMainProducts(res)
    }, (err: any) => {
      Auth_error_handling(err, this.Notification, this.router)
    }))
  }
  GetProductChildren(Product: Product){
   return  this.ProductChildren =  this.AllProducts.filter(product => product.parentItemId == Product._id)
  }
  NextSection(CurrentChild: number){
    if(CurrentChild < this.ProductChildren.length -1){
      this.ChildProductOnDisplay = this.ProductChildren[CurrentChild + 1]._id
    }else{
      this.ChildProductOnDisplay = this.ProductChildren[0]._id
    }
  }
  PreviousSection(CurrentChild: number){
    if(CurrentChild > 0){
      this.ChildProductOnDisplay = this.ProductChildren[CurrentChild - 1]._id
    }else{
      this.ChildProductOnDisplay = this.ProductChildren[this.ProductChildren.length -1]._id
    }
  }
  GetMainProducts(Products :Product[]){
     return Products.filter(Product => Product.parentItemId =="")
  }
  ShowDetails(ProductToShow: Product) {
    this.ProductDetails = ProductToShow._id == this.ProductDetails? "": ProductToShow._id;
    this.ChildProductOnDisplay = this.GetProductChildren(ProductToShow)[0]._id
  }
  ViewImage(Product: Product){
    var w = window.open(this.GetItemImageLink(Product));
  }
  ViewSpecSheet(Product: Product){
    window.open(this.GetSpecSheetLink(Product))
  }
  GetItemImageLink(Product: Product){
    let APIURL = InDevMode ? "http://localhost:5000/Assets/Products/" : "https://macksdis.com/Assets/Products/"
    return APIURL + Product.itempic;
  }
  GetSpecSheetLink(Product: Product){
    let APIURL = InDevMode ? "http://localhost:5000/Assets/Products/" : "https://macksdis.com/Assets/Products/"
    return APIURL + Product.itemdescfile;
  }
}
