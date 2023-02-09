import { TASK } from "./Task.js";
import local from "./localStorage.js";
import { ui } from "./UI.js";
export const inp = document.querySelector("#inp");
export const clear = document.querySelector("#clr");
export const clearPopCont = document.querySelector(".pop-del-cont ");
export const clearPopup = document.querySelector(".pop-del ");
const clrPopBtn = document.querySelector(".clr-pop");
const cancel = document.querySelector(".cancel");
export const tasks = document.querySelector("#tasks");
export const filter = document.querySelectorAll("#filters span");
const doneIcon = `<i class="fa-solid fa-check-double"></i>`;
const undoneIcon = `<i class="fa-solid fa-circle-xmark"></i>`;
export let newArr;
export let updateId;
export let clickedFilterIndex = 0;
export let Mode = "create";
export let arr = [];
const handelTime = () => new Date().toLocaleTimeString();
export const handelDate = () => new Date().toLocaleDateString();
class Actions {
    constructor() {
        if (Actions.instance) {
            return Actions.instance;
        }
        Object.freeze(this);
        Actions.instance = this;
    }
    removeCreatedclass() {
        if (localStorage.getItem("iscreated")) {
            setTimeout(() => {
                document.querySelector(".task").classList.remove("task-created");
                localStorage.removeItem("iscreated");
            }, 1000);
        }
    }
    addDataToArr() {
        console.log("2 ", Mode);
        if (Mode === "create") {
            const id = Math.random() * 100;
            const content = inp.value;
            const checked = false;
            const text = "created";
            const date = handelDate();
            const time = handelTime();
            const task = new TASK(id, content, checked, text, date, time);
            arr.unshift(task);
            localStorage.setItem("iscreated", "true");
            this.checkData(arr);
            ui.handlePopUp("success", "task sucessfully added !", doneIcon);
        }
        else {
            newArr = arr.map((ele) => {
                return +ele.id === updateId
                    ? Object.assign(Object.assign({}, ele), { content: inp.value, date: handelDate(), time: handelTime(), text: "updated", checked: false }) : ele;
            });
            arr = newArr;
            ui.showData(arr);
            Mode = "create";
            ui.handlePopUp("success", "task sucessfully updated !", doneIcon);
        }
        local.saveDataToLocalStorage(arr);
        ui.handlePlaceholderText();
        ui.handleSubmitBtn();
        this.handleFilterText(arr);
        this.hideOptionsCont(arr);
        this.autoClick();
        inp.value = "";
        this.removeInpBorder();
        inp.focus();
    }
    handleIndex(index) {
        let num = arr.length;
        if (index >= num) {
            return 0;
        }
        else if (index < 0) {
            return arr.length - 1;
        }
        else {
            return index;
        }
    }
    actionFn(e) {
        var _a, _b, _c, _d, _e;
        const parent = (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (e.target.classList.contains("del")) {
            e.target.classList.add("deleted");
            const deleted = arr.find((e) => +e.id == +parent.dataset.id);
            console.log(deleted);
            console.log(deleted.id);
            (_b = document.getElementById(deleted.id)) === null || _b === void 0 ? void 0 : _b.classList.add("deleted");
            console.log(document.getElementById(deleted.id));
            document.querySelectorAll(".task").forEach((e) => {
                e.dataset.id == deleted.id ? e.classList.add("task-deleted") : null;
                console.log(e);
            });
            ui.handlePopUp("success", "task sucessfully deleted", doneIcon);
            newArr = arr.filter((ele) => +ele.id !== +parent.dataset.id);
            arr = newArr;
            local.saveDataToLocalStorage(arr);
            setTimeout(() => {
                var _a;
                this.checkData(arr);
                this.handleFilterText(arr);
                if (arr.length == 0) {
                    this.removeActiveClass();
                    (_a = document.querySelector("span.all")) === null || _a === void 0 ? void 0 : _a.classList.add("active");
                }
                this.autoClick();
            }, 1000);
        }
        if (e.target.classList.contains("update")) {
            Mode = "update";
            inp.value = "";
            inp.focus();
            updateId = +parent.dataset.id;
            let updatedElementIndex = arr.findIndex((e) => e.id == updateId);
            inp.value = arr[updatedElementIndex].content;
            ui.handlePlaceholderText();
            ui.handleSubmitBtn();
            this.checkData(arr);
            local.saveDataToLocalStorage(arr);
            this.autoClick();
            this.handleFilterText(arr);
        }
        if (e.target.classList.contains("up")) {
            updateId = +((_c = parent.parentElement) === null || _c === void 0 ? void 0 : _c.dataset.id);
            let upElementIndex = arr.findIndex((e) => e.id == updateId);
            [arr[this.handleIndex(upElementIndex - 1)], arr[upElementIndex]] = [
                arr[upElementIndex],
                arr[this.handleIndex(upElementIndex - 1)],
            ];
            this.checkData(arr);
            this.autoClick();
            local.saveDataToLocalStorage(arr);
        }
        if (e.target.classList.contains("down")) {
            updateId = +((_d = parent.parentElement) === null || _d === void 0 ? void 0 : _d.dataset.id);
            let upElementIndex = arr.findIndex((e) => e.id == updateId);
            [arr[upElementIndex], arr[this.handleIndex(upElementIndex + 1)]] = [
                arr[this.handleIndex(upElementIndex + 1)],
                arr[upElementIndex],
            ];
            this.checkData(arr);
            this.autoClick();
            local.saveDataToLocalStorage(arr);
        }
        if (e.target.classList.contains("check")) {
            newArr = arr.map((e) => e.id == +parent.dataset.id && e.checked == false
                ? Object.assign(Object.assign({}, e), { checked: true, date: handelDate(), time: handelTime(), text: "checked" }) : e.id == +parent.dataset.id && e.checked == true
                ? Object.assign(Object.assign({}, e), { checked: false, date: handelDate(), time: handelTime(), text: "unchecked" }) : e);
            arr = newArr;
            this.checkData(arr);
            local.saveDataToLocalStorage(arr);
            this.autoClick();
        }
        this.handleFilterText(arr);
        // this.checkData(arr);
        // local.saveDataToLocalStorage(arr);
        // this.autoClick();
        if (arr.length == 0) {
            this.removeActiveClass();
            (_e = document.querySelector("span.all")) === null || _e === void 0 ? void 0 : _e.classList.add("active");
        }
    }
    autoClick() {
        filter[clickedFilterIndex].click();
    }
    removeActiveClass() {
        filter.forEach((e) => {
            e.classList.remove("active");
        });
    }
    handleClearAllPop() {
        clearPopCont.classList.remove("hide");
    }
    clearAll() {
        arr.splice(0);
        this.checkData(arr);
        ui.handlePopUp("success", "All sucessfully cleard", doneIcon);
        local.saveDataToLocalStorage(arr);
        this.handleFilterText(arr);
        this.hideOptionsCont(arr);
    }
    hideClrPop() {
        clearPopCont.classList.add("hide");
        clearPopup.classList.remove("hide");
    }
    handleClearing(e) {
        if (e.target.classList.contains("clr-pop")) {
            this.clearAll();
            this.hideClrPop();
        }
        else if (e.target.classList.contains("cancel")) {
            clearPopup.classList.add("hide");
            this.hideClrPop();
        }
    }
    displayClearAllBtn(arr) {
        if (arr.length < 2) {
            clear.classList.add("hide");
            clear.classList.remove("block");
        }
        else if (arr.length >= 2) {
            clear.classList.remove("hide");
            clear.classList.add("block");
        }
        clear.innerHTML = `Clear All (${arr.length})`;
    }
    handleFilterText(arr) {
        let all = document.querySelector("span.all");
        let updated = document.querySelector("span.updated");
        let completed = document.querySelector("span.completed");
        let pending = document.querySelector("span.pending");
        all.innerHTML = `All(${arr.length})`;
        updated.innerHTML = `Updated(${arr.filter((e) => e.text == "updated").length})`;
        completed.innerHTML = `Completed(${arr.filter((e) => e.text == "checked").length})`;
        pending.innerHTML = `Pending(${arr.filter((e) => e.text != "checked").length})`;
    }
    handleFilters(e) {
        let tempArr = [];
        if (e.target.classList.contains("all")) {
            tempArr = arr;
            clickedFilterIndex = 0;
            this.checkData(arr);
        }
        else if (e.target.classList.contains("updated")) {
            tempArr = arr.filter((ele) => ele.text == "updated");
            clickedFilterIndex = 3;
            this.checkData(tempArr);
        }
        else if (e.target.classList.contains("completed")) {
            tempArr = arr.filter((ele) => ele.text == "checked");
            this.checkData(tempArr);
            clickedFilterIndex = 2;
        }
        else {
            tempArr = arr.filter((ele) => ele.text != "checked");
            this.checkData(tempArr);
            clickedFilterIndex = 1;
        }
        this.checkData(tempArr);
        this.hideOptionsCont(arr);
    }
    hideOptionsCont(arr) {
        if (arr.length == 0) {
            document.querySelector("#options").classList.add("hide");
        }
        else {
            document.querySelector("#options").classList.remove("hide");
        }
    }
    checkData(arr) {
        var _a;
        if (arr.length == 0) {
            this.displayClearAllBtn(arr);
            ui.showData(arr);
            const div = document.createElement("div");
            div.setAttribute("class", `no-data`);
            div.innerHTML = `No ${filter[clickedFilterIndex].dataset.state}tasks to show`;
            tasks.insertAdjacentElement("afterbegin", div);
        }
        else {
            this.removeCreatedclass();
            (_a = document.querySelector(".no-data")) === null || _a === void 0 ? void 0 : _a.classList.add("hide");
            ui.showData(arr);
        }
        this.hideOptionsCont(arr);
    }
    validiation() {
        if (inp.value.length === 0) {
            ui.handlePopUp("danger", "add a task please !", undoneIcon);
        }
        else if (inp.value.length >= 1 && inp.value.length <= 24) {
            this.addDataToArr();
        }
        else {
            ui.handlePopUp("danger", "you can't exceed 25 letters", undoneIcon);
        }
    }
    handleInpBorder(e) {
        if (inp.value.length === 0) {
            this.removeInpBorder();
        }
        else if (inp.value.length < 25 && inp.value.length >= 1) {
            inp.classList.add("valid");
            inp.classList.remove("invalid");
        }
        else {
            inp.classList.add("invalid");
            inp.classList.remove("valid");
        }
    }
    removeInpBorder() {
        if (inp.value.length === 0) {
            inp.classList.remove("valid");
            inp.classList.remove("invalid");
        }
    }
    resetMode() {
        Mode = "create";
    }
    handleeCreatedClass() {
        const tasksAdded = document.querySelector(".task");
        tasksAdded.forEach((e) => e.classList.remove("created"));
    }
}
export const action = new Actions();
