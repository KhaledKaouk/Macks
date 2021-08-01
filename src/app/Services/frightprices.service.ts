import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { frightPrices } from '../Models/frightPrices';

@Injectable({
  providedIn: 'root'
})
export class FrightpricesService {

  constructor(private http: HttpClient) { }

  GetAllFrightPrices(){
    return this.http.get('https://macksdistribution.com/api/account/getfrightprices').toPromise();
  }

  AddFrightPrice(NewFrightPrice: frightPrices){
    return this.http.post('',NewFrightPrice).toPromise();
  }

  UpdateFrightPricesByBulk(UpdatedFrightPrices: frightPrices[]){
    return this.http.post('',UpdatedFrightPrices).toPromise();
  }

  UpdateSinglefrightPrice(UpdatedFrithPrice: frightPrices){
    return this.http.post('',UpdatedFrithPrice).toPromise();
  }
  DeleteFrightPrice(FrightPriceId: number){
    return this.http.post('',FrightPriceId).toPromise();
  }
}
