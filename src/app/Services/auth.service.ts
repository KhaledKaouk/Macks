import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token } from '../Models/token';
import { NotificationserService } from './notificationser.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private notification: NotificationserService) { }

  LogIn(UserName: string, Password: string){
    
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

    let grant_type: string= "password";
    let username: string = UserName;
    let password: string = Password;
    
    let body = `grant_type=${grant_type}&username=${username}&password=${password}`;
    
    return this.http.post<Token>("https://macksdistribution.com/token",body,{headers: headers});
  }

  GetToken(){
    return localStorage.getItem('token');
  }

  GetRole(){
    return this.http.get('https://macksdistribution.com/api/account/GetUserRole').toPromise().then((res: any) => {
      localStorage.setItem('Role',res ?? "")
    },(err:any) =>{
    })
  }
}
