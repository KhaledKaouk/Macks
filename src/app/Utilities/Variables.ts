import { Inject } from "@angular/core"
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
    Admin: ["Approve", "MackPo", "ShippingDocs", "Reject", "CorinthainPo", "ApplyChanges", "MackUpload", "Delete"],
    Corinthain: ["ShippingDocs", "CorinthainPo", "ProductionRequestDate"],
    Alfemo: ["MackPo", "Update"]
}

export type Tools = {
    notifications: NotificationserService,
    router: Router,
    dialog: MatDialog,
    spinner: Spinner,
    PoService: POsService

}

export let InDevMode = localStorage.getItem('DevMode')?.toLowerCase() === "true" ? true : false

