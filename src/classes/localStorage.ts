import { action, arr, DATA } from "./Actions.js";
import { ui } from "./UI.js";

class LocalStorageDATA {
  static #count = 0;
  static instance: any;
  constructor() {
    if (LocalStorageDATA.instance) {
      return LocalStorageDATA.instance;
    }
    Object.freeze(this);
    LocalStorageDATA.instance = this;
    LocalStorageDATA.#count++;
  }

  saveDataToLocalStorage(arr: DATA[]): void {
    localStorage.setItem("data", JSON.stringify(arr));
  }

  getcount() {
    console.log(LocalStorageDATA.#count);
  }
  getDataFromLocalStorage(): void {
    if (localStorage.data) {
      arr.push(...JSON.parse(localStorage.data));
    }
    /* show data when reloading  */
    action.checkData(arr);
    ui.handleCheck(arr);
  }
}

let local = new LocalStorageDATA();

export default local;
