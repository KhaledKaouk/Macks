import { Product } from "../Models/Product";

export function FilterProductsByName(ListOfProducts: Product[], SearchKeyWord: string){
    return  ListOfProducts.filter(Product => Product.itemname.toLowerCase().includes(SearchKeyWord.toLowerCase()))
}