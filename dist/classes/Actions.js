import { TASK } from "./Task.js";
import local from "./localStorage.js";
import { ui } from "./UI.js";
export const inp = document.querySelector("#inp");
export const clear = document.querySelector("#clr");
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
const handelDate = () => new Date().toLocaleDateString();
class Actions {
    constructor() {
        if (Actions.instance) {
            return Actions.instance;
        }
        Object.freeze(this);
        Actions.instance = this;
    }
    addDataToArr() {
        if (Mode === "create") {
            const id = Math.random() * 100;
            const content = inp.value;
            const checked = false;
            const text = "created";
            const date = handelDate();
            const time = handelTime();
            const task = new TASK(id, content, checked, text, date, time);
            arr.unshift(task);
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
        inp.focus();
    }
    actionFn(e) {
        var _a, _b;
        const parent = (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (e.target.classList.contains("del")) {
            newArr = arr.filter((ele) => +ele.id !== +parent.dataset.id);
            arr = newArr;
            ui.handlePopUp("success", "task sucessfully deleted", doneIcon);
            this.checkData(arr);
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
            console.log("mode" + Mode);
        }
        if (e.target.classList.contains("check")) {
            newArr = arr.map((e) => e.id == +parent.dataset.id && e.checked == false
                ? Object.assign(Object.assign({}, e), { checked: true, date: handelDate(), time: handelTime(), text: "checked" }) : e.id == +parent.dataset.id && e.checked == true
                ? Object.assign(Object.assign({}, e), { checked: false, date: handelDate(), time: handelTime(), text: "unchecked" }) : e);
            arr = newArr;
        }
        /* add data to ui */
        this.checkData(arr);
        this.handleFilterText(arr);
        local.saveDataToLocalStorage(arr);
        if (arr.length == 0) {
            this.removeActiveClass();
            (_b = document.querySelector("span.all")) === null || _b === void 0 ? void 0 : _b.classList.add("active");
        }
        this.autoClick();
    }
    autoClick() {
        filter[clickedFilterIndex].click();
    }
    removeActiveClass() {
        filter.forEach((e) => {
            e.classList.remove("active");
        });
    }
    clearAll() {
        arr.splice(0);
        this.checkData(arr);
        ui.handlePopUp("success", "All sucessfully cleard", doneIcon);
        local.saveDataToLocalStorage(arr);
        this.handleFilterText(arr);
        this.hideOptionsCont(arr);
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
            (_a = document.querySelector(".no-data")) === null || _a === void 0 ? void 0 : _a.classList.add("hide");
            ui.showData(arr);
        }
        this.hideOptionsCont(arr);
    }
    validiation() {
        if (inp.value.length > 0) {
            this.addDataToArr();
        }
        else {
            ui.handlePopUp("danger", "add a task please !", undoneIcon);
        }
    }
    resetMode() {
        Mode = "create";
        ui.handleSubmitBtn();
    }
}
export const action = new Actions();
