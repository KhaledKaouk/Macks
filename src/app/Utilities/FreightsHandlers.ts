import { freightPrices } from "../Models/frightPrices";

export function FilterFreightByPort(Freights: freightPrices[], SearchKey: string){
    return Freights.filter(Freight => Freight.Port.toLowerCase().includes(SearchKey.toLowerCase()))
}