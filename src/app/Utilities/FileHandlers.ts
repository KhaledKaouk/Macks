import { PrefixNot } from "@angular/compiler";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { resolve } from "dns";
import * as JSZip from "jszip";
import { POs } from "../Models/Po-model";
import { NotificationserService } from "../Services/notificationser.service";
import { POsService } from "../Services/pos.service";
import { AddPreffixAndExtention, DIs, GetCurrentDate, HideDialog, RemoveSlashes, ReplaceBackSlashInDate, ShowDialog, Spinner } from "./Common";
import { Auth_error_handling } from "./Errorhadling";
import { Tools } from "./Variables";

export async function UploadFile<T>(
    FormData: FormData,
    FileName: string,
    DIs: DIs,
    dialogRef?: MatDialogRef<T>
) {
    let result: boolean = false;
    DIs.spinner.ShowSpinner();
    HideDialog(dialogRef)
    await DIs.PoService.Uploadfile(FormData, FileName)
        .toPromise()
        .then(
            res => result = true,
            err => Auth_error_handling(err, DIs.notification, DIs.router)
        ).finally(() => {
            DIs.spinner.HideSppiner();
            ShowDialog(dialogRef)
        });
    return result
}

export function DownLoadFile(Directory: string, FileName: string) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'http://localhost:5000/Assets/' + Directory + FileName);
    link.setAttribute('download', FileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export function ConstructFileName(PO: POs, PreFix: string, Extention: string) {
    if (PreFix == "Archive_") PreFix = PreFix + ReplaceBackSlashInDate(GetCurrentDate()) + "_";
    return AddPreffixAndExtention(
        PreFix,
        RemoveSlashes(PO.dealerPoNumber) + "_" + RemoveSlashes(PO.corinthianPoNumber),
        Extention)
}
export function ConstructFormDataFile(Files: any, FileName: string) {
    let fd = new FormData();
    fd.append('PO', Files, FileName);

    return fd;
}
export async function GenerateZipBlob(JZip: JSZip) {
    let Zipblob: Blob = new Blob();
    await JZip.generateAsync({ type: 'blob' }).then(content => {
        Zipblob = content
    })
    return Zipblob
}
export async function CombineFilesInZip(Files: any) {
    let zip = new JSZip();
    Array.from(Files).forEach((File: any) => {
        zip.file(File.name, File)
    })
    return await GenerateZipBlob(zip)

}