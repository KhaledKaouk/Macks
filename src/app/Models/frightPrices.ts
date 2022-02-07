export class freightPrices{
    _id: number;
    Port: string;
    City: string;
    State: string;
    ZipCode: string;
    PortToPortPrice: number;
    Validty: string;
    TruckDeliveryPrice: number;
    RailDeliveryPrice: number;
    RailRamp: string;
    Carrier: string

    constructor(){
        this._id = 0;
        this.Port = "";
        this.City = "";
        this.State ="";
        this.ZipCode = "";
        this.PortToPortPrice = 0;
        this.Validty = "";
        this.TruckDeliveryPrice =0;
        this.RailDeliveryPrice = 0;
        this.RailRamp =""
        this.Carrier = "";
    }


}