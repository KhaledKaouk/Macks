import { Dealers } from "../Models/Dealers"
import { DealersService } from "../Services/dealers.service";
import { Auth_error_handling } from "./Errorhadling";

export function FilterDealersByName(ListOfDealers: Dealers[], DealerName: string) {
    return ListOfDealers.filter(Dealer => Dealer.name.toLowerCase().includes(DealerName.toLowerCase()))
}

export async function CheckDealersForDuplicate(InspectedDealer: Dealers, DealerService: DealersService) {
    let IsDupicate: boolean = false;
    await DealerService.GetAllDealers().then((res: any) => {
        let Dealers: Dealers[] = res;
        IsDupicate = Dealers.filter(Dealer => Dealer.name.toLowerCase() == InspectedDealer.name.toLowerCase()).length > 0
    })
    console.log(IsDupicate)
    return IsDupicate
}

export function GetDealerById(AllDealers: Dealers[], DealerId: number){
    console.log()
    return AllDealers.find(Dealer => Dealer.id == DealerId) || new Dealers()
}
export function CompareDealerNames(FirstDealerName: string,SecondDealerName: string){
   return (FirstDealerName[0].toLowerCase() > SecondDealerName[0].toLowerCase())? +1 : -1
}