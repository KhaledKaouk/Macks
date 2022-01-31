import { Invoice } from "./Invoice";
import { POs } from "./Po-model";

export class Shipment{
    _id: string;
    BOLNumber: string;
    BookingNumber: string;
    Status: string;
    Vessel: string;
    LoadingPort: string;
    DischargePort: string;
    ContainerNumbers: string[];
    ETA: string;
    ETD: string;
    LoadingDate: string;
    HBL: string;
    MBL: string;
    HTS: string;
    DeliveryDestination: string;
    Invoice: Invoice;
    POs: POs[];
    CompanyId: string;

    constructor(){
        this._id = "";
        this.BOLNumber = "";
        this.BookingNumber = "";
        this.Status = "";
        this.Vessel = "";
        this.LoadingPort = "";
        this.DischargePort = "";
        this.ContainerNumbers = [];
        this.ETA = "";
        this.ETD = "";
        this.LoadingDate = "";
        this.HBL = "";
        this.MBL = "";
        this.HTS = "";
        this.DeliveryDestination = "";
        this.Invoice = new Invoice();
        this.POs = [];
        this.CompanyId ="";

    }
}