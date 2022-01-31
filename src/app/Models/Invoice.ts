import { ProductShippingDetails } from "./CommercialInvoice";

export class Invoice {
    _id: string;
    Number: string;
    ShipmentId:string;
    Date: string;
    ProductsPrice: number;
    FreightPrice: number;
    PaymentMethod: string;
    BankDetails: string;
    SwiftCode: string;
    IBANNo: string;
    ProductShippingDetails: ProductShippingDetails[]

    constructor() {
        this._id = "";
        this.Number = "";
        this.ShipmentId = "";
        this.Date = "";
        this.ProductsPrice = 0;
        this.FreightPrice = 0;
        this.PaymentMethod = "";
        this.BankDetails = "";
        this.SwiftCode = "";
        this.IBANNo = "";
        this.ProductShippingDetails = [];
    }



}