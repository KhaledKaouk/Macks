import * as JSZip from "jszip";

export async function Unzip(file: File) {
    let zip = new JSZip();
    let ZipContents: any[] = [];

    let JszipContent = await zip.loadAsync(file)

    for (let filename of Object.keys(JszipContent.files)) {
      await zip.file(filename)?.async('blob').then((content) => {
        ZipContents.push(new File([content], filename))
      })
    }
    return ZipContents as File[]
  }