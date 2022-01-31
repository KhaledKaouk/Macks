import { Inject, Type } from "@angular/core"
import { MatDialog, MatDialogRef } from "@angular/material/dialog"
import { Router } from "@angular/router"
import { NgProgress } from "ngx-progressbar"
import { NotificationserService } from "../Services/notificationser.service"
import { POsService } from "../Services/pos.service"
import { Spinner } from "./Common"

export let Directories: { [key: string]: string } = {
    MackPo: "MP/",
    ShippingDocument: "SD/",
    CorinthainPo: "NP/"
}
export let Functionalities: { [key: string]: string[] } = {
    Admin: ["Approve", "MackPo", "ShippingDocs", "Reject", "CorinthainPo", "ApplyChanges", "MackUpload", "Delete", "Cancel", "Hold"],
    Corinthain: ["ShippingDocs", "CorinthainPo", "ProductionRequestDate"],
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

export let InDevMode = localStorage.getItem('DevMode')?.toLowerCase() === "true" ? true : false

export let APIURL = InDevMode ? 'http://localhost:5000/' : 'https://macksdis.com/';
