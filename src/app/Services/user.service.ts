import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../Models/User';
import { InDevMode } from '../Utilities/Variables';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  ApiURL: string = "http://macksdis.com/User";
  constructor(private http: HttpClient) {
    if (InDevMode) this.ApiURL = "http://localhost:5000/User"
   }

   GetUsers(){
     return this.http.get(this.ApiURL + "/GetUsers").toPromise();
   }
   CreateUser(NewUser: User){
     return this.http.post(this.ApiURL + "/CreateUser",NewUser).toPromise();
   }
   UpdateUser(UpdatedUser: User){
     return this.http.post(this.ApiURL + "/UpdateUser", UpdatedUser).toPromise();
   }
   DeleteUser(DeletedUser:User){
     return this.http.post(this.ApiURL + "/DeleteUser", DeletedUser).toPromise();
   }
}
