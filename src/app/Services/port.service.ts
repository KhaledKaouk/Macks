import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { port } from '../Models/port';
import { APIURL, InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class PortService {

  Route: string = "Port"
  constructor(private http: HttpClient) { }

  GetPorts() {
    return this.http.get(APIURL + this.Route + '/getports').toPromise()
  }
  CreatePort(NewPort: port) {
    return this.http.post(APIURL + this.Route + '/createport', NewPort).toPromise()
  }
  UpdatePort(UpdatedPort: port) {
    return this.http.post(APIURL + this.Route + '/updateport', UpdatedPort).toPromise()
  }
  DeletePort(DeletedPort: port) {
    this.http.post(APIURL + this.Route + '/deleteport', DeletedPort).toPromise();
  }
}
