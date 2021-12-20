import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from 'src/app/Models/Product';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { ProductService } from 'src/app/Services/product.service';
import { RemoveSearchDisclaimer, ShowSearchDisclaimer, Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { DownLoadFile } from 'src/app/Utilities/FileHandlers';
import { FilterProductsByName } from 'src/app/Utilities/ProductsHandlers';
import { UpdateProductComponent } from '../update-product/update-product.component';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.sass']
})
export class AllProductsComponent implements OnInit {

  Products: Product[] = [];
  PageCountArray: number[] = [0]
  PagesCount: number = 1;
  DataRowsInPage: number = 15;
  DataOfCurrentPage: Product[] = [];
  CurrentPage: number = 0;

  constructor(
    private MatDialog: MatDialog,
    private ProductService: ProductService,
    private spinner: Spinner,
    private router: Router,
    private notificationService: NotificationserService
  ) { }

  ngOnInit(): void {
    this.GetProducts();
  }

  GetProducts(){
    this.spinner.WrapWithSpinner(this.ProductService.GetProducts().then(
      (Products: any) => this.PrepareDataForDisplay(Products),
      (err: any) =>{
      Auth_error_handling(err,this.notificationService,this.router)
    } ))
  }
  PrepareDataForDisplay(Products: any){
    this.Products = Products
      this.PagesCount = Math.ceil(this.Products.length / this.DataRowsInPage);
      this.PageCountArray = Array(this.PagesCount).fill(0).map((x, i) => i)
      this.SliceDataForPaginantion(0)
  }
  UpdateProduct(Product: Product){
    this.MatDialog.open(UpdateProductComponent,{
      height: '30rem',
      width: '30rem',
      data: Product
    })
  }
  SearchByName(event: any){
    this.SliceDataForPaginantion(0,FilterProductsByName(this.Products,event.target.value))
    
  }
  NextPage(){
    this.SliceDataForPaginantion(this.CurrentPage + 1)

  }
  PreviousPage(){
    this.SliceDataForPaginantion(this.CurrentPage - 1)

  }
  SliceDataForPaginantion(PageNumber: number,Products?: Product[]){
    if(Products) console.log(Products)
    let PortsForSlicing: Product[] = this.Products;
    if (Products) PortsForSlicing = Products;
    let SliceBegining = PageNumber * this.DataRowsInPage;
    if (PortsForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage).length >= 1) {
      RemoveSearchDisclaimer();
      this.DataOfCurrentPage = PortsForSlicing.slice(SliceBegining, SliceBegining + this.DataRowsInPage)
      this.CurrentPage = PageNumber;
    }else{
      this.DataOfCurrentPage = [];
      ShowSearchDisclaimer(this.DataOfCurrentPage.length);
    }
  }

  DownLoadImage(ImageFileName: string){
    DownLoadFile('Products/',ImageFileName)
  }
  DownLoadSheet(SheetFileName: string){
    DownLoadFile('Products/',SheetFileName)
  }
  DeleteProduct(Product: Product) {
    if (confirm('Are you sure you want to delete this product'))
      this.spinner.WrapWithSpinner(this.ProductService.DeleteProduct(Product).then(
        res => {
          this.notificationService.OnSuccess('Product Deleted')
          location.reload();
        },
        err => Auth_error_handling(err,this.notificationService,this.router)
      ))
  }  
  CheckImageFile(Product: Product){
    return Product.itempic != '';
  }
  CheckDescFile(Product: Product){
    return Product.itemdescfile != ''
  }
}
