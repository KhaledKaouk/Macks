import { resolve } from "dns";
import { Dealers } from "../Models/Dealers";
import { POs } from "../Models/Po-model";
import { POsService } from "../Services/pos.service";

export function AddNewDealer(NewDealer: Dealers) {
    return new Promise((resolve) => {
        NewDealer.name = NewDealer.name.replace(/[^a-zA-Z0-9 ]/g, " ")
        let Dealer = NewDealer;

        let DB = window.indexedDB.open("Dealers");

        DB.onsuccess = function (event) {
            let db = DB.result;

            let NewDealer = db.transaction("DealersInfo", "readwrite")
            let Store = NewDealer.objectStore("DealersInfo");
            let AddDealer = Store.add(Dealer);
            AddDealer.onsuccess = function (event) { }
            NewDealer.oncomplete = function () {
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
    if (DBDealers.find(Dealer => !Dealer.name)) {
        await ClearDB();
        console.log("Data Cleared")
    }
    for (let Po of AllPos) {
        let NewDealer: Dealers = { Id: CreateDealerId(), name: Po.dealerName, email: Po.dealerEmail, mobile: "", address: "" };
        if (DBDealers.length == 0) {
             AddNewDealer(NewDealer);
            await PromiseAllDealers().then((res: any) => {
                DBDealers = res;
            })
        } else {
            if (DBDealers.filter(Dealer => Dealer.name.toLowerCase() === Po.dealerName.replace(/[^a-zA-Z0-9 ]/g, " ").toLowerCase()).length === 0) {
                 AddNewDealer(NewDealer);
                 console.log(NewDealer.name)
            }
            await PromiseAllDealers().then((res: any) => {
                DBDealers = res;
            })
        }
    }
}
export function ClearDB() {
    return new Promise((resolve) => {
        let DB = window.indexedDB.open("Dealers");

        DB.onsuccess = function (event) {
            let Waiting = true;
            let db = DB.result;
            let ClearTransaction = db.transaction("DealersInfo", "readwrite")
            let Stroe = ClearTransaction.objectStore("DealersInfo")
            let ClearData = Stroe.clear();
            ClearData.onsuccess = function (event) { }
            ClearTransaction.oncomplete = function () {
                resolve(Waiting)
            }
        }
    })
}
export function DeleteDealer(Dealer: Dealers) {
    return new Promise((resolve) => {
        let DB = window.indexedDB.open("Dealers");

        DB.onsuccess = function (event) {
            let db = DB.result;

            let NewDealer = db.transaction("DealersInfo", "readwrite")
            let Store = NewDealer.objectStore("DealersInfo");
            let DeleteDealer = Store.delete(Dealer.Id);

            DeleteDealer.onsuccess = function (event) { }
            NewDealer.oncomplete = function () {
                resolve(Dealer)
            }
        }
    })
}
export function UpdateDealer(Dealer: Dealers) {
    return new Promise((resolve) => {
        let DB = window.indexedDB.open("Dealers");

        DB.onsuccess = function (event) {
            let db = DB.result;

            let NewDealer = db.transaction("DealersInfo", "readwrite")
            let Store = NewDealer.objectStore("DealersInfo");
            let AddDealer = Store.put(Dealer);

            AddDealer.onsuccess = function (event) { }
            NewDealer.oncomplete = function () {
                resolve(Dealer)
            }
        }
    })
}