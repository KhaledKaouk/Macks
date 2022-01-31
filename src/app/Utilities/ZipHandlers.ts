import * as JSZip from "jszip";
import { Shipment } from "../Models/Shipment";
import { GenerateZipBlob } from "./FileHandlers";
import { APIURL } from "./Variables";

export async function Unzip(file: File) {
  let zip = new JSZip();
  let ZipContents: any[] = [];

  let JszipContent = await zip.loadAsync(file)

  for (let filename of Object.keys(JszipContent.files)) {
    await zip.file(filename)?.async('blob').then(async (content) => {
      if (filename.toLowerCase().includes('.zip')) {
        (await Unzip(new File([content], filename))).forEach(file => {
          ZipContents.push(file)
        })
      }
      if (filename.toLowerCase().includes('.pdf')) ZipContents.push(new File([content], filename, { type: 'application/pdf' }))
      if (filename.toLowerCase().includes('.xls')) ZipContents.push(new File([content], filename, { type: 'application/vnd.ms-excel' }))
      if (filename.toLowerCase().includes('.doc')) ZipContents.push(new File([content], filename, { type: 'application/msword' }))
    })
  }
  return ZipContents as File[]
}
export async function ReplaceFileInShippingDocs(shipment: Shipment, FileName: string, File: File) {
  let ShippingDocsZip = await GetShippingDocs(shipment);
  let JsZipShippingDocs = await GetJsZipShippingDocs(ShippingDocsZip)

  JsZipShippingDocs.remove(FileName)
  JsZipShippingDocs.file(FileName, File)

  return await GenerateZipBlob(JsZipShippingDocs)

}
export async function GetShippingDocs(shipment: Shipment) {
  let ShippingDocsFile: any;

  let ResponseWithShippingDocsBlob = await fetch(APIURL + 'Assets/SD/' + 'SD_' + shipment.Invoice.Number + '.zip')
  let ShippingDocsBlob = await ResponseWithShippingDocsBlob.clone().blob();

  ShippingDocsFile = ShippingDocsBlob;
  ShippingDocsFile.name = shipment.Invoice.Number + '.zip'
  ShippingDocsFile.lastModifiedDate = new Date();

  return ShippingDocsFile as File
}

export async function GetJsZipShippingDocs(ShippingDocs: File) {
  let CopyOfShippingDocs = new JSZip();
  let OldDocs = await Unzip(ShippingDocs)

  OldDocs.forEach(file => {
    if (GetFileExtenstion(file) != 'zip') {
      CopyOfShippingDocs.file(file.name, file)
    }
  })
  return CopyOfShippingDocs
}
export function GetFileExtenstion(file: File) {
  let indexOExtention = file.name.indexOf('.') + 1;
  return file.name.substring(indexOExtention, file.name.length)
}
