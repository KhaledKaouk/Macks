export class POs {
    id: number;
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
    
    constructor(){
            this.id = 0;
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



    }

}