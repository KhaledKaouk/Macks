export class ProductOrder{
    ProductCode: string;
    Product: string;
    QTY: number;
    Fabric: string;
    Price: number;
    Piece: number;

    constructor(){
        this.ProductCode = "";
        this.Product = "";
        this.QTY = 1;
        this.Fabric = "";
        this.Price = 0;
        this.Piece = 0;

    }

}