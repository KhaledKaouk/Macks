import { resolve } from "dns";
import { Dealers } from "../Models/Dealers";
import { POs } from "../Models/Po-model";
import { POsService } from "../Services/pos.service";

export function AddNewDealer(NewDealer: Dealers) {
   return  new Promise((resolve) => {
        NewDealer.DealerName = NewDealer.DealerName.replace(/[^a-zA-Z0-9 ]/g, " ")
        let Dealer = NewDealer;

        let DB = window.indexedDB.open("Dealers");

        DB.onsuccess = function (event) {
            let db = DB.result;

            let NewDealer = db.transaction("DealersInfo", "readwrite")
            let Store = NewDealer.objectStore("DealersInfo");
            let AddDealer = Store.add(Dealer);

            AddDealer.onsuccess = function (event) { }
            NewDealer.oncomplete = function(){
                resolve(Dealer)
            }
        }
    })
}
export function PromiseAllDealers() {
    return new Promise((resolve) => {
        let DB = window.indexedDB.open("Dealers");

        let Result: any;
        DB.onsuccess = function (event) {
            let db = DB.result;
            let AllStores = db.transaction("DealersInfo", "readwrite");
            let DealerStore = AllStores.objectStore("DealersInfo");
            let GetAllDealers = DealerStore.getAll();
            GetAllDealers.onsuccess = function (event: any) {
                Result = GetAllDealers.result;
            }
            AllStores.oncomplete = function () {
                resolve(Result)
            }
        }
    })
}
export function CreateDealerId() {
    return Math.random().toFixed(6);
}
export async function CheckDealersToMatchOfflineDB(PoService: POsService) {
    let AllPos: POs[] = [];
    let DBDealers: Dealers[] = [];

    await PoService.GetPos().then((res: any) => {
        AllPos = res;
    })
    await PromiseAllDealers().then((res: any) => {
        DBDealers = res
    });

    if (DBDealers.filter(Dealer => { Dealer.DealerName === "Farmers Furniture-Russellville AL" }).length >= 1) {
        ClearDB();
        console.log("database has been cleared")
    }
    for (let Po of AllPos) {
        let NewDealer: Dealers = { Id: CreateDealerId(), DealerName: Po.dealerName, Email: Po.dealerEmail };
        if (DBDealers.length == 0) {
            AddNewDealer(NewDealer);
            await PromiseAllDealers().then((res: any) => {
                DBDealers = res;
            })
        } else {
            if (DBDealers.filter(Dealer => Dealer.DealerName === Po.dealerName.replace(/[^a-zA-Z ]/g, " ")).length === 0) { AddNewDealer(NewDealer) }
            await PromiseAllDealers().then((res: any) => {
                DBDealers = res;
            })
        }
    }
}
export function ClearDB() {
    let DB = window.indexedDB.open("Dealers");

    DB.onsuccess = function (event) {
        let db = DB.result;
        let NewDealer = db.transaction("DealersInfo", "readwrite").objectStore("DealersInfo").clear();
        NewDealer.onsuccess = function (event) { }
    }
}