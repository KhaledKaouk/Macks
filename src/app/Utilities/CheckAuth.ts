import { Router } from "@angular/router";

export function CheckToken(router: Router){
    if(!localStorage.getItem('token')){
        router.navigateByUrl('/LogIn')
    }
}

export function CheckCorinthianUserPermissions() {
    let HolleyUser: string = "HolleyF"
    return localStorage.getItem('username')?.toLowerCase() === HolleyUser.toLowerCase()
}