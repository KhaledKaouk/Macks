import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token } from '../Models/token';
import { InDevMode } from '../Utilities/Variables';
import { NotificationserService } from './notificationser.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  ApiURL: string = "http://macksdis.com/Auth";
  GetRoleApi: string = "http://macksdis.com/Auth";
  constructor(private http: HttpClient,
    private notification: NotificationserService) {
      if (InDevMode) {
        this.ApiURL = "http://localhost:5000/Auth"
        this.GetRoleApi = "http://localhost:5000/Auth" 
      }
     }

  LogIn(UserName: string, Password: string){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

    let grant_type: string= "password";
    let username: string = UserName;
    let password: string = Password;
    
    let body = `grant_type=${grant_type}&username=${username}&password=${password}`;
    
    return this.http.post<Token>(this.ApiURL + "/token",body,{headers: headers});
  }

  GetToken(){
    return localStorage.getItem('token');
  }

  async GetRole(){
    return await this.http.get<string>(this.GetRoleApi + "/GetUserRole").toPromise().then((res: string) => {
      localStorage.setItem('Role',res.toLowerCase() ?? "")
    },(err:any) =>{
    })
  }
}
