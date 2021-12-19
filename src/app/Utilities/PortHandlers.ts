import { port } from "../Models/port";

export function FilterPortsByNameAndCity(ListOfPorts: port[], SearchKeyWord: string){
    return ListOfPorts.filter(Port => Port.portName.toLowerCase().includes(SearchKeyWord.toLowerCase()) || Port.city.toLowerCase().includes(SearchKeyWord.toLowerCase()))
}
