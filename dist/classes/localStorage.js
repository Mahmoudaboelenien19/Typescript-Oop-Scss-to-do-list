var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _LocalStorageDATA_count;
import { action, arr } from "./Actions.js";
import { ui } from "./UI.js";
class LocalStorageDATA {
    constructor() {
        var _b, _c;
        if (LocalStorageDATA.instance) {
            return LocalStorageDATA.instance;
        }
        Object.freeze(this);
        LocalStorageDATA.instance = this;
        __classPrivateFieldSet(_b = LocalStorageDATA, _a, (_c = __classPrivateFieldGet(_b, _a, "f", _LocalStorageDATA_count), _c++, _c), "f", _LocalStorageDATA_count);
    }
    saveDataToLocalStorage(arr) {
        localStorage.setItem("data", JSON.stringify(arr));
    }
    getcount() {
        console.log(__classPrivateFieldGet(LocalStorageDATA, _a, "f", _LocalStorageDATA_count));
    }
    getDataFromLocalStorage() {
        if (localStorage.data) {
            arr.push(...JSON.parse(localStorage.data));
        }
        /* show data when reloading  */
        action.checkData(arr);
        ui.handleCheck(arr);
    }
}
_a = LocalStorageDATA;
_LocalStorageDATA_count = { value: 0 };
let local = new LocalStorageDATA();
export default local;
