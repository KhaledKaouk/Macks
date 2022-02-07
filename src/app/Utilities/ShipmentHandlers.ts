import { POs } from "../Models/Po-model";
import { Shipment } from "../Models/Shipment";
import { ShipmentStatus } from "./Variables";

export function FilterByPOsNumberOrInvoiceNumber(Shipments: Shipment[], SearchKey: string) {
    return Shipments.filter(shipment => (shipment.Invoice.Number.toLowerCase().includes(SearchKey.toLowerCase())) || SearchPosBoNumber(SearchKey, shipment.POs))
}
function SearchPosBoNumber(SearchKey: string, Pos: POs[]) {
    return Pos.filter(po => (po.dealerPoNumber.toLocaleLowerCase().includes(SearchKey.toLocaleLowerCase())) || (po.corinthianPoNumber.toLocaleLowerCase().includes(SearchKey.toLocaleLowerCase()))).length > 0
}
export function GetShipment(AllShipments: Shipment[], ShipmentId: String){
    return AllShipments.find(shipment => shipment._id == ShipmentId) || new Shipment();
}
export function CheckShipmentBooking(Shipment: Shipment){
    return Shipment.Status = ShipmentStatus[0]
}