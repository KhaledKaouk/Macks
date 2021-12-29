import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from 'src/app/Models/Product';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { ProductService } from 'src/app/Services/product.service';
import { Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { ConstructFormDataFile } from 'src/app/Utilities/FileHandlers';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.sass']
})
export class CreateProductComponent implements OnInit {


  NewProductForm = new FormGroup({
    ProductName: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
    LineName: new FormControl('', Validators.required),
    Dimensions: new FormControl(''),
    ParentProduct: new FormControl('')
  })
  NewProduct: Product = new Product();
  ProductImage: any;
  ProductDescriptionFile: any;
  AllProducts: Product[] = [];

  constructor(
    private dialogref: MatDialogRef<CreateProductComponent>,
    private ProductService: ProductService,
    private notificationService: NotificationserService,
    private router: Router,
    private spinner: Spinner
  ) { }

  ngOnInit(): void {
    this.GetAllProducts();
  }
  GetAllProducts() {
    this.spinner.WrapWithSpinner (this.ProductService.GetProducts().then((Products: any) => {
      this.AllProducts = Products;
    }))
  }
  async Submit() {
    let ImageUploaded = false
    let DescriptionFileUploaded = false
    let ProductCreated = false
    this.AssignFormValuesIntoProductObject();
    this.spinner.ShowSpinner()
    ImageUploaded = await this.UploadProductImage()
    if (ImageUploaded) { DescriptionFileUploaded = await this.UploadDescriptionFile() };
    if (DescriptionFileUploaded) ProductCreated = await this.CreateProduct();
    this.spinner.HideSppiner()
  }
  Close() {
    this.dialogref.close();
  }
  SaveDescriptionFileInObject(event: any) {
    this.ProductDescriptionFile = event.target.files[0];
  }
  SaveImageFileInObject(event: any) {
    this.ProductImage = event.target.files[0];
  }
  AssignFormValuesIntoProductObject() {
    this.NewProduct.itemname = this.NewProductForm.get('ProductName')?.value;
    this.NewProduct.itemdesc = this.NewProductForm.get('Description')?.value;
    this.NewProduct.linename = this.NewProductForm.get('LineName')?.value;
    this.NewProduct.dimensions = this.NewProductForm.get('Dimensions')?.value;
    this.NewProduct.parentItemId = this.NewProductForm.get('ParentProduct')?.value;
  }
  async UploadProductImage() {
    let result = true;
    if (this.ProductImage) {
      this.NewProduct.itempic = this.ProductImage.name
      await this.ProductService.UploadProductImage(
        ConstructFormDataFile(this.ProductImage, this.ProductImage.name),
        this.ProductImage.name).then(
          res => { result = true; this.notificationService.OnSuccess('Image Uploaded') },
          err => {
            Auth_error_handling(err, this.notificationService, this.router);
            result = false
          })
    }
    return result;
  }
  async UploadDescriptionFile() {
    let result = true;
    if (this.ProductDescriptionFile) {
      this.NewProduct.itemdescfile = this.ProductDescriptionFile.name
      await this.ProductService.UploadDescriptionFile(
        ConstructFormDataFile(this.ProductDescriptionFile, this.ProductDescriptionFile.name),
        this.ProductDescriptionFile.name).then(
          res => { result = true; this.notificationService.OnSuccess('Sheet Uploaded') },
          err => {
            Auth_error_handling(err, this.notificationService, this.router);
            result = false
          })
    }
    return result;
  }
  async CreateProduct() {
    let result = true;
    await this.ProductService.CreateProduct(this.NewProduct).then(
      res => {
        result = true;
        this.notificationService.OnSuccess('Product Created');
        location.reload()
      },
      err => {
        Auth_error_handling(err, this.notificationService, this.router);
        result = false
      })
    return result
  }



}
