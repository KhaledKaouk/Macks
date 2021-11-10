export class ProductShippingDetails {
    NO: string;
    PRODUCT_CODE: string;
    PRODUCT: string;
    Po: string;
    QTY: number;
    PACKS: number;
    TOTAL_PACKS: number;
    UNIT_KG: number;
    TOTAL_KG: number;
    UNIT_CUBM: number;
    TOTAL_CUBM: number;
    UNIT_PRICE: number;
    TOTAL_PRICE: number;

    constructor() {
        this.NO = '0',
        this.PRODUCT_CODE = '',
        this.PRODUCT = '',
        this.Po = '',
        this.QTY = 0,
        this.PACKS = 0,
        this.TOTAL_PACKS = this.QTY * this.PACKS,
        this.UNIT_KG = 0,
        this.TOTAL_KG = this.QTY * this.UNIT_KG,
        this.UNIT_CUBM = 0,
        this.TOTAL_CUBM = this.QTY * this.UNIT_CUBM,
        this.UNIT_PRICE = 0,
        this.TOTAL_PRICE = this.QTY * this.UNIT_PRICE
    }
    CreatePropertyTR(tbody: HTMLElement) {
        let Tr = tbody.appendChild(document.createElement('tr'))
        this.CreatePropertyTd(this.NO, Tr)
        this.CreatePropertyTd(this.PRODUCT_CODE, Tr)
        this.CreatePropertyTd(this.PRODUCT, Tr)
        this.CreatePropertyTd(this.Po, Tr)
        this.CreatePropertyTd(this.QTY.toString(), Tr)
        this.CreatePropertyTd(this.PACKS.toString(), Tr)
        this.CreatePropertyTd(this.TOTAL_PACKS.toString(), Tr)
        this.CreatePropertyTd(this.UNIT_KG.toString(), Tr)
        this.CreatePropertyTd(this.TOTAL_KG.toString(), Tr)
        this.CreatePropertyTd(this.UNIT_CUBM.toString(), Tr)
        this.CreatePropertyTd(this.TOTAL_CUBM.toString(), Tr)
        this.CreatePropertyTd(this.UNIT_PRICE.toString(), Tr)
        this.CreatePropertyTd(this.TOTAL_PRICE.toString(), Tr)

    }
    CreatePropertyTd(PropertyValue: string, Tr: HTMLElement) {
        let TD = document.createElement('td')
        TD.textContent = PropertyValue
        Tr.appendChild(TD)
        return TD
    }

}