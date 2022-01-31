import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TouchSequence } from 'selenium-webdriver';
import { Invoice } from '../Models/Invoice';
import { InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  ApiUrl = "https://macksdis.com/Invoice";
  constructor(private http: HttpClient) {
    if (InDevMode) this.ApiUrl = "http://localhost:5000/Invoice"
  }

  GetInvoices(){
    return this.http.get(this.ApiUrl + "/GetInvoices").toPromise();
  }
  CreateInvoice(NewInvoice: Invoice) {
    return this.http.post(this.ApiUrl + "/CreateInvoice" , NewInvoice).toPromise();
  }
  UpdateInvoice(UpdatedInvoice: Invoice){
    return this.http.post(this.ApiUrl + "/UpdateInvoice", UpdatedInvoice).toPromise();
  }
  DeleteInvoice(DeletedInvoice: Invoice){
    return this.http.post(this.ApiUrl + "/DeleteInvoice" , DeletedInvoice).toPromise();
  }
}
