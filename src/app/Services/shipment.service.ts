import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shipment } from '../Models/Shipment';
import { APIURL } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  Route: string = "Shipment"
  constructor(private http: HttpClient) {
   }
   GetAllShipments(){
     return this.http.get(APIURL + this.Route+ '/GetShipments').toPromise();
   }
  GetShipmentById(Id: string) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    header.append('Id',Id)

    let params = new HttpParams().set('Id',Id)

    return this.http.get(APIURL + this.Route+ "/GetShipmentById", {headers: header,params:params}).toPromise();
  }
  CreatShipment(NewShipment: Shipment) {
    return this.http.post(APIURL + this.Route+ "/CreateShipment", NewShipment).toPromise()
  }
  UpdateShipment(UpdateShipment: Shipment) {
    return this.http.post(APIURL + this.Route+ "/UpdateShipment", UpdateShipment).toPromise()
  }
  DeleteShipment(DeletedShipment: Shipment) {
    return this.http.post(APIURL + this.Route+ "/DeleteShipment", DeletedShipment).toPromise()
  }
}
