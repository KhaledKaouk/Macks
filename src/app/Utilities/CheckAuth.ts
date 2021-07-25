import { Router } from "@angular/router";

export function CheckToken(router: Router){
    if(!localStorage.getItem('token')){
        router.navigateByUrl('/LogIn')
    }
}