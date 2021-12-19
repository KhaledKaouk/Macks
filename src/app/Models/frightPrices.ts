export class freightPrices{
    _id: number;
    locations: string;
    currentprice: number;
    oldprice: number;
    changedon: string;
    deliveryType: string;
    port: string;

    constructor(){
        this._id = 0;
        this.locations = "";
        this.currentprice = 0;
        this.oldprice = 0;
        this.changedon = "";
        this.deliveryType = "";
        this.port = "";
    }


}