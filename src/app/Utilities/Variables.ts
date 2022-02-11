import { MatDialog } from "@angular/material/dialog"
import { Router } from "@angular/router"
import { NotificationserService } from "../Services/notificationser.service"
import { POsService } from "../Services/pos.service"
import { Spinner } from "./Common"

export let Directories: { [key: string]: string } = {
    MackPo: "MP/",
    ShippingDocument: "SD/",
    CorinthainPo: "NP/"
}
export let Functionalities: { [key: string]: string[] } = {
    Admin: ["MoreDetails","Approve", "MackPo", "ShippingDocs", "Reject", "CorinthainPo", "ApplyChanges", "MackUpload", "Delete", "Cancel", "Hold"],
    Corinthain: ["MoreDetails","ShippingDocs", "CorinthainPo", "ProductionRequestDate"],
    Alfemo: ["MackPo", "Update"]
}

export type Status = "Canceled" | "On Hold" | "Cancel Request" | "Hold Request" | "In Production"
    | "Booked" | "confirm Po Receipt" | "Waiting For Production" | "ContainerBooked" | "Loading" | "Shipped";
export type Tools = {
    notifications: NotificationserService,
    router: Router,
    dialog: MatDialog,
    spinner: Spinner,
    PoService: POsService

}

export let ShipmentStatus: string[] = ['Container Booked','Loading','Shipped']
export let InDevMode = localStorage.getItem('DevMode')?.toLowerCase() === "true" ? true : false

export let APIURL = InDevMode ? 'http://localhost:5000/' : 'https://macksdis.com/';

export let DataRowInPage: number = parseInt(localStorage.getItem('DataRowInPage') || '15')
