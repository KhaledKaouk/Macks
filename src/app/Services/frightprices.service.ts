import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { freightPrices } from '../Models/frightPrices';
import { APIURL, InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class FrightpricesService {

  Route: string = "FreightPrice"
  constructor(private http: HttpClient) { }

  GetAllFrightPrices() {
    return this.http.get(APIURL + this.Route + '/getfrightprices').toPromise();
  }

  AddFrightPrice(NewFrightPrice: freightPrices) {
    return this.http.post(APIURL + this.Route + '/createfrightprices', NewFrightPrice).toPromise();
  }

  UpdateFrightPricesByBulk(UpdatedFrightPrices: freightPrices[]) {
    return this.http.post(APIURL + this.Route + '/CreateFreightsByBulk', UpdatedFrightPrices).toPromise();
  }

  UpdateSinglefrightPrice(UpdatedFrithPrice: freightPrices) {
    return this.http.post(APIURL + this.Route + '/Updatefrightprices', UpdatedFrithPrice).toPromise();
  }
  DeleteFrightPrice(FrightPriceId: number) {
    return this.http.post('', FrightPriceId).toPromise();
  }
}
