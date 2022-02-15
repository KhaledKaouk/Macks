import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TouchSequence } from 'selenium-webdriver';
import { Invoice } from '../Models/Invoice';
import { APIURL, InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  Route: string = "Invoice"
  constructor(private http: HttpClient) { }

  GetInvoices() {
    return this.http.get(APIURL + this.Route + "/GetInvoices").toPromise();
  }
  CreateInvoice(NewInvoice: Invoice) {
    return this.http.post(APIURL + this.Route + "/CreateInvoice", NewInvoice).toPromise();
  }
  UpdateInvoice(UpdatedInvoice: Invoice) {
    return this.http.post(APIURL + this.Route + "/UpdateInvoice", UpdatedInvoice).toPromise();
  }
  DeleteInvoice(DeletedInvoice: Invoice) {
    return this.http.post(APIURL + this.Route + "/DeleteInvoice", DeletedInvoice).toPromise();
  }
}
