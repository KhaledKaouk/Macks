import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../Models/Product';
import { InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  ApiURL: string = "https://macksdis.com/Product";

  constructor(private http: HttpClient) {
    if (InDevMode) this.ApiURL = "http://localhost:5000/Product"
   }

  GetProducts(){
    return this.http.get(this.ApiURL + '/GetProducts').toPromise();
  }
  CreateProduct(NewProduct: Product){
    return this.http.post(this.ApiURL + '/CreateProduct', NewProduct).toPromise();
  }
  UpdateProduct(UpdatedProduct: Product){
    return this.http.post(this.ApiURL + '/UpdateProduct',UpdatedProduct).toPromise();
  }
  DeleteProduct(Product: Product){
    return this.http.post(this.ApiURL  + '/Deleteproduct',Product ).toPromise();
  }
  UploadProductImage(formData: FormData, FileName: string){
    return this.http.post(this.ApiURL + '/ProductFiles', formData, { 'params': { filename: FileName } }).toPromise();
  }
  UploadDescriptionFile(formData: FormData, FileName: string){
    return this.http.post(this.ApiURL + '/ProductFiles', formData, { 'params': { filename: FileName } }).toPromise();
  }
}
