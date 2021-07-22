export class POs {
    id: number;
    dealerName: string;
    dealerPONumber: string;
    mackPONumber: string;
    corinthianPO: string;
    itemID: number;
    supplierName: string;
    userID: string;
    mackPOAttach: string;
    corinthianPOAttach: string;
    ShippingDocs: string;
    comments: string;
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
    
    constructor(){
            this.id = 0;
            this.dealerName = "";
            this.dealerPONumber = "0";
            this.mackPONumber = "";
            this.corinthianPO = "";
            this.itemID = 0;
            this.supplierName = "";
            this.userID = "";
            this.mackPOAttach = "";
            this.corinthianPOAttach = "";
            this.ShippingDocs = "";
            this.comments = "";
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



    }

}