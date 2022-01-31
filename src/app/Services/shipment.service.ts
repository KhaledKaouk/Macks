import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shipment } from '../Models/Shipment';
import { InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  ApiUrl = "https://macksdis.com/Shipment";
  constructor(private http: HttpClient) {
    if (InDevMode) this.ApiUrl = "http://localhost:5000/Shipment"
   }
   GetAllShipments(){
     return this.http.get(this.ApiUrl + '/GetShipments').toPromise();
   }
  GetShipmentById(Id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    header.append('Id',Id)

    let params = new HttpParams().set('Id',Id)

    return this.http.get(this.ApiUrl + "/GetShipmentById", {headers: header,params:params}).toPromise();
  }
  CreatShipment(NewShipment: Shipment) {
    return this.http.post(this.ApiUrl + "/CreateShipment", NewShipment).toPromise()
  }
  UpdateShipment(UpdateShipment: Shipment) {
    return this.http.post(this.ApiUrl + "/UpdateShipment", UpdateShipment).toPromise()
  }
  DeleteShipment(DeletedShipment: Shipment) {
    return this.http.post(this.ApiUrl + "/DeleteShipment", DeletedShipment).toPromise()
  }
}
