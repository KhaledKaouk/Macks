import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from 'src/app/Models/Product';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { ProductService } from 'src/app/Services/product.service';
import { Spinner } from 'src/app/Utilities/Common';
import { Auth_error_handling } from 'src/app/Utilities/Errorhadling';
import { ConstructFormDataFile } from 'src/app/Utilities/FileHandlers';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.sass']
})
export class UpdateProductComponent implements OnInit {

  UpdateProductForm = new FormGroup({
    ProductName: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
    LineName: new FormControl('', Validators.required),
    Dimensions: new FormControl('')
  })
  ProductToUpdate: Product = new Product();
  ProductImage: any;
  ProductDescriptionFile: any;
  constructor(
    private dialogref: MatDialogRef<UpdateProductComponent>,
    private ProductService: ProductService,
    private notificationService: NotificationserService,
    private router: Router,
    private spinner: Spinner,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) { }

  ngOnInit(): void {
    this.ProductToUpdate = this.data;
    this.AssignProductToUpdateForm();
  }
  AssignProductToUpdateForm() {
    this.UpdateProductForm.setValue({
      ProductName: this.ProductToUpdate.itemname,
      Description: this.ProductToUpdate.itemdesc,
      LineName: this.ProductToUpdate.linename,
      Dimensions: this.ProductToUpdate.dimensions,

    })
  }
  AssignFormValueToProductObject() {
    this.ProductToUpdate.itemname = this.UpdateProductForm.get('ProductName')?.value
    this.ProductToUpdate.itemdesc = this.UpdateProductForm.get('Description')?.value
    this.ProductToUpdate.linename = this.UpdateProductForm.get('LineName')?.value
    this.ProductToUpdate.dimensions = this.UpdateProductForm.get('Dimensions')?.value

  }
  SaveDescriptionFileInObject(event: any) {
    this.ProductDescriptionFile = event.target.files[0];
  }
  SaveImageFileInObject(event: any) {
    this.ProductImage = event.target.files[0];
  }
  async UploadProductImage() {
    let result = true;
    if (this.ProductImage) {
      this.ProductToUpdate.itempic = this.ProductImage.name
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
      this.ProductToUpdate.itemdescfile = this.ProductDescriptionFile.name
      await this.ProductService.UploadDescriptionFile(
        ConstructFormDataFile(this.ProductDescriptionFile, this.ProductDescriptionFile.name),
        this.ProductDescriptionFile.name
      ).then(
        res => { result = true; this.notificationService.OnSuccess('Sheet Uploaded') },
        err => {
          Auth_error_handling(err, this.notificationService, this.router);
          result = false
        })
    }
    return result;
  }
  async UpdateProduct() {
    let result = true;
    await this.ProductService.UpdateProduct(this.ProductToUpdate).then(
      res => {
        result = true
        this.notificationService.OnSuccess('Product Updated')
        location.reload();
      },
      err => {
        result = false;
        Auth_error_handling(err, this.notificationService, this.router)
      }
    )
    return result
  }

  async Submit() {
    let ImageUploaded = false
    let DescriptionFileUploaded = false
    let ProductCreated = false
    this.AssignFormValueToProductObject();
    this.spinner.ShowSpinner()
    ImageUploaded = await this.UploadProductImage()
    if (ImageUploaded) { DescriptionFileUploaded = await this.UploadDescriptionFile() };
    if (DescriptionFileUploaded) ProductCreated = await this.UpdateProduct();
    this.spinner.HideSppiner()
  }
  Close() {
    this.dialogref.close();
  }
}
