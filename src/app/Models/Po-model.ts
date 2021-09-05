export class POs {
    id: number;
    dealer_id: string;
    dealerName: string;
    dealerEmail: string;
    dealerPONumber: string;
    mackPONumber: string;
    corinthianPO: string;
    itemID: number;
    supplierName: string;
    userID: string;
    mackPOAttach: string;
    corinthianPOAttach: string;
    shipBy:string;
    shippingDocs: string;
    comments: string;
    alfemoComments:string;
    status: string;
    productionRequestDate: string;
    factoryEstimatedShipDate: string;
    dateReceived: string;
    factoryEstimatedArrivalDate: string;
    booked: boolean;
    finalDestLocation: string;
    containerNumber: string;
    productionRequestTime: string;
    approvalStatus: boolean;
    deleted: boolean;
    invoiceDate: string;
    [key:string]: string | boolean | number;
    constructor(){
            this.id = 0;
            this.dealer_id = "",
            this.dealerName = "";
            this.dealerEmail = "";
            this.dealerPONumber = "0";
            this.mackPONumber = "";
            this.corinthianPO = "";
            this.itemID = 0;
            this.supplierName = "";
            this.userID = "";
            this.mackPOAttach = "";
            this.corinthianPOAttach = "";
            this.shipBy = ""
            this.shippingDocs = "";
            this.comments = "";
            this.alfemoComments="";
            this.status = "";
            this.productionRequestDate = "";
            this.factoryEstimatedShipDate = "";
            this.dateReceived = "";
            this.factoryEstimatedArrivalDate = "";
            this.booked = false;
            this.finalDestLocation = "";
            this.containerNumber = "";
            this.productionRequestTime = "";
            this.approvalStatus = false;
            this.deleted = false;
            this.invoiceDate = "";
    }

}