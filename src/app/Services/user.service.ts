import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Models/User';
import { APIURL } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  Route: string = "User"
  constructor(private http: HttpClient) { }

  GetUsers() {
    return this.http.get(APIURL + this.Route + "/GetUsers").toPromise();
  }
  CreateUser(NewUser: User) {
    return this.http.post(APIURL + this.Route + "/CreateUser", NewUser).toPromise();
  }
  UpdateUser(UpdatedUser: User) {
    return this.http.post(APIURL + this.Route + "/UpdateUser", UpdatedUser).toPromise();
  }
  DeleteUser(DeletedUser: User) {
    return this.http.post(APIURL + this.Route + "/DeleteUser", DeletedUser).toPromise();
  }
}
