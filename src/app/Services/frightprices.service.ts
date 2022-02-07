import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { freightPrices } from '../Models/frightPrices';
import { InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class FrightpricesService {

  ApiURL: string = "https://macksdis.com/FreightPrice";
  constructor(private http: HttpClient) {
    if (InDevMode) this.ApiURL = "http://localhost:5000/FreightPrice"
   }

  GetAllFrightPrices(){
    return this.http.get(this.ApiURL +'/getfrightprices').toPromise();
  }

  AddFrightPrice(NewFrightPrice: freightPrices){
    return this.http.post(this.ApiURL + '/createfrightprices',NewFrightPrice).toPromise();
  }

  UpdateFrightPricesByBulk(UpdatedFrightPrices: freightPrices[]){
    return this.http.post(this.ApiURL + '/CreateFreightsByBulk',UpdatedFrightPrices).toPromise();
  }

  UpdateSinglefrightPrice(UpdatedFrithPrice: freightPrices){
    return this.http.post(this.ApiURL + '/Updatefrightprices',UpdatedFrithPrice).toPromise();
  }
  DeleteFrightPrice(FrightPriceId: number){
    return this.http.post('',FrightPriceId).toPromise();
  }
}
