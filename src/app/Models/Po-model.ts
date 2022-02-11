import { ProductOrder } from "./ProductOrder";

export class POs {
    _id: string;
    dealer_id: string;
    dealerPoNumber: string;
    mackPoNumber: string;
    corinthianPoNumber: string;
    ProductsOrders: ProductOrder[] 
    mackPOAttach: string;
    corinthianPOAttach: string;
    userId: string;
    shipBy:string;
    shippingDocs: string;
    corinthianComments: string;
    alfemoComments:string;
    status: string;
    productionRequestDate: string;
    productionStartDate: string;
    productionFinishDate: string;
    factoryEstimatedShipDate: string;
    factoryLoadDate: string;
    dateOfDeparture: string;
    dateReceived: string;
    factoryEstimatedArrivalDate: string;
    finalDestLocation: string;
    containerNumber: string;
    productionRequestTime: string;
    approvalStatus: boolean;
    deleted: boolean;
    Archived: boolean;
    invoiceDate: string;
    port: string;
    ShipmentId: string;
    [key:string]: string | boolean | number | ProductOrder[];
    constructor(){
            this._id = "";
            this.dealer_id = "",
            this.dealerPoNumber = "";
            this.mackPoNumber = "";
            this.corinthianPoNumber = "";
            this.ProductsOrders = [];
            this.userId = "";
            this.mackPOAttach = "";
            this.corinthianPOAttach = "";
            this.shipBy = ""
            this.shippingDocs = "";
            this.corinthianComments = "";
            this.alfemoComments="";
            this.status = "";
            this.productionRequestDate = "";
            this.productionStartDate = "";
            this.productionFinishDate = "";
            this.factoryLoadDate = "";
            this.dateOfDeparture = "";
            this.factoryEstimatedShipDate = "";
            this.dateReceived = "";
            this.factoryEstimatedArrivalDate = "";
            this.finalDestLocation = "";
            this.containerNumber = "";
            this.productionRequestTime = "";
            this.approvalStatus = false;
            this.deleted = false;
            this.invoiceDate = "";
            this.port = "";
            this.ShipmentId ="";
            this.Archived = false;
    }

}