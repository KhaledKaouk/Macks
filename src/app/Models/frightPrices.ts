export class frightPrices{
    id: number;
    locations: string;
    currentprice: number;
    oldprice: number;
    changedon: string;
    deliveryType: string;

    constructor(){
        this.id = 0;
        this.locations = "";
        this.currentprice = 0;
        this.oldprice = 0;
        this.changedon = "";
        this.deliveryType = "";
    }


}