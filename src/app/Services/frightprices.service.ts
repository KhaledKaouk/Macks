import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { frightPrices } from '../Models/frightPrices';
import { InDevMode } from '../Utilities/Common';

@Injectable({
  providedIn: 'root'
})
export class FrightpricesService {

  ApiURL: string = "https://macksdistribution.com/api/account";
  constructor(private http: HttpClient) {
    if (InDevMode) this.ApiURL = "http://localhost:5000"
   }

  GetAllFrightPrices(){
    return this.http.get(this.ApiURL +'/getfrightprices').toPromise();
  }

  AddFrightPrice(NewFrightPrice: frightPrices){
    return this.http.post(this.ApiURL + '/createfrightprices',NewFrightPrice).toPromise();
  }

  UpdateFrightPricesByBulk(UpdatedFrightPrices: frightPrices[]){
    return this.http.post('',UpdatedFrightPrices).toPromise();
  }

  UpdateSinglefrightPrice(UpdatedFrithPrice: frightPrices){
    return this.http.post(this.ApiURL + '/Updatefrightprices',UpdatedFrithPrice).toPromise();
  }
  DeleteFrightPrice(FrightPriceId: number){
    return this.http.post('',FrightPriceId).toPromise();
  }
}
