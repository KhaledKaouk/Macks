import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../Models/Product';
import { APIURL, InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  Route: string = "Product"
  constructor(private http: HttpClient) { }

  GetProducts() {
    return this.http.get(APIURL + this.Route + '/GetProducts').toPromise();
  }
  CreateProduct(NewProduct: Product) {
    return this.http.post(APIURL + this.Route + '/CreateProduct', NewProduct).toPromise();
  }
  UpdateProduct(UpdatedProduct: Product) {
    return this.http.post(APIURL + this.Route + '/UpdateProduct', UpdatedProduct).toPromise();
  }
  DeleteProduct(Product: Product) {
    return this.http.post(APIURL + this.Route + '/Deleteproduct', Product).toPromise();
  }
  UploadProductImage(formData: FormData, FileName: string) {
    return this.http.post(APIURL + this.Route + '/ProductFiles', formData, { 'params': { filename: FileName } }).toPromise();
  }
  UploadDescriptionFile(formData: FormData, FileName: string) {
    return this.http.post(APIURL + this.Route + '/ProductFiles', formData, { 'params': { filename: FileName } }).toPromise();
  }
}
