export function AddPreffixAndExtention(Preffix:string,FileNameBody:string,GetExtentionFrom:string){
    let extenstion: string = GetExtentionFrom;
    extenstion = extenstion.substring(extenstion.lastIndexOf('.'));

    let AdjustedFileName: string = Preffix + FileNameBody + extenstion;

    return AdjustedFileName;  
}