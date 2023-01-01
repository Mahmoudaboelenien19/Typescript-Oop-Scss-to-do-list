"use strict";
const inp = document.querySelector('#inp');
const form = document.querySelector('form');
const btn = document.querySelector('#btn');
const clearCont = document.querySelector('#options');
const clear = document.querySelector('#clr');
const tasks = document.querySelector('#tasks');
const taskCont = document.querySelector(".task-cont");
const placeholder = document.querySelector("#placeholder");
const filter = document.querySelectorAll("#filters span");
// let cont= document.querySelector(".container")
let isFocus = false;
let clickedFilterIndex = 0;
const doneIcon = `<i class="fa-solid fa-check-double"></i>`;
const undoneIcon = `<i class="fa-solid fa-circle-xmark"></i>`;
for (let i = 0; i < 300; i++) {
    // let span=`<span> </span>`;
    let span = document.createElement("span");
    span.setAttribute("class", "bg-span");
    document.querySelector(".bg-cont").insertAdjacentElement("afterbegin", span);
}
const handelTime = () => new Date().toLocaleTimeString();
const handelDate = () => new Date().toLocaleDateString();
let arr = [];
// let tempArr: DATA[] = [];
class TASK {
    constructor(id, content, checked, text, date, time) {
        this.id = id;
        this.content = content;
        this.checked = checked;
        this.text = text;
        this.date = date;
        this.time = time;
        this.id = id,
            this.content = content,
            this.checked = checked,
            this.text = text,
            this.date = date,
            this.time = time;
    }
}
class LocalStorageDATA {
    static saveDataToLocalStorage(arr) {
        localStorage.setItem("data", JSON.stringify(arr));
    }
    static getDataFromLocalStorage() {
        if (localStorage.data) {
            arr = JSON.parse(localStorage.data);
        }
        /* show data when reloading  */
        Actions.checkData(arr);
        UI.handleCheck(arr);
    }
}
class UI {
    static handleCheck(arr) {
        let checked = document.querySelectorAll("#content p");
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].checked == true) {
                console.log("checked");
                checked[i].classList.add("checked");
                console.log(checked[i]);
            }
            else {
                checked[i].classList.remove("checked");
            }
        }
    }
    static showData(arr) {
        tasks.innerHTML = '';
        for (let i = 0; i < arr.length; i++) {
            tasks.innerHTML += `
      <div class="task ${arr[i].text}" data-id=${arr[i].id}>
      <div id=content >
      <p id="content"  >${arr[i].content}</p></div>
      <div id="time">
      <span  class="text ${arr[i].text}">${arr[i].text} in</span>
      <span class="time"  >Time : ${arr[i].time}</span>
      <span class="date"  ><span style="color:black">&&</span> Date : ${arr[i].date}</span>
      
      </div>
<div id="btns">
<i title="update" class="fa-solid fa-pen-to-square fa-sm update"></i>
<i title="check"  class="fa fa-check fa-sm check " aria-hidden="true"></i>
<i  title="del" class="fa-solid fa-x fa-sm del"></i></div>
</div>`;
        }
        UI.handleCheck(arr);
        Actions.displayClearAllBtn(arr);
    }
    static handleInp() {
        let placeholder = document.querySelector("form span");
        if (isFocus) {
            placeholder === null || placeholder === void 0 ? void 0 : placeholder.classList.add("focus");
            placeholder === null || placeholder === void 0 ? void 0 : placeholder.classList.remove("blur");
        }
        else {
            placeholder === null || placeholder === void 0 ? void 0 : placeholder.classList.remove("focus");
            placeholder === null || placeholder === void 0 ? void 0 : placeholder.classList.add("blur");
            UI.handlePlaceholderText();
        }
        UI.handleSubmitBtn();
    }
    static addDataToArr() {
        if (UI.Mode === "create") {
            const id = Math.random() * 100;
            const content = inp.value;
            const checked = false;
            const text = "created";
            const date = handelDate();
            const time = handelTime();
            const task = new TASK(id, content, checked, text, date, time);
            arr.unshift(task);
            Actions.checkData(arr);
            UI.handlePopUp("success", "task sucessfully added !", doneIcon);
        }
        else {
            Actions.newArr = arr.map((ele) => {
                return +(ele.id) === UI.updateId ? Object.assign(Object.assign({}, ele), { content: inp.value, date: handelDate(), time: handelTime(), text: "updated", checked: false }) : ele;
            });
            arr = Actions.newArr;
            UI.showData(arr);
            UI.Mode = "create";
            UI.handlePopUp("success", "task sucessfully updated !", doneIcon);
        }
        inp.value = '';
        LocalStorageDATA.saveDataToLocalStorage(arr);
        UI.handlePlaceholderText();
        UI.handleSubmitBtn();
        Actions.handleFilterText(arr);
        Actions.hideOptionsCont(arr);
        Actions.autoClick();
    }
    static handlePlaceholderText() {
        if (UI.Mode === "create") {
            placeholder.innerHTML = "add a task";
        }
        else {
            placeholder.innerHTML = "update task";
        }
    }
    static handleSubmitBtn() {
        btn.innerHTML = UI.Mode === "create" ? "add tasks" : "update";
    }
    static handlePopUp(clr, msg, icon) {
        // const pop = `<div class='pop ${clearCont}'>${msg}</div>` as Element  ;
        const div = document.createElement("span");
        div.setAttribute("class", `pop ${clr}`);
        // const text = document.createTextNode(msg)
        // div.appendChild(text)
        div.innerHTML = `${icon} ${msg}`;
        let parent = document.querySelector(".pop-cont");
        parent.insertAdjacentElement("afterbegin", div);
        let popUps = document.querySelectorAll(".pop");
        popUps.forEach(ele => {
            setTimeout(() => {
                ele === null || ele === void 0 ? void 0 : ele.remove();
            }, 4000);
        });
    }
}
UI.Mode = "create";
class Actions {
    static actionsFn(e) {
        var _a, _b;
        const parent = (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (e.target.classList.contains("del")) {
            Actions.newArr = arr.filter((ele) => +(ele.id) !== +(parent.dataset.id));
            arr = Actions.newArr;
            UI.handlePopUp("success", "task sucessfully deleted", doneIcon);
            Actions.checkData(arr);
        }
        if (e.target.classList.contains("update")) {
            inp.value = "";
            UI.Mode = "update";
            inp.focus();
            UI.updateId = +parent.dataset.id;
            let updatedElementIndex = arr.findIndex(e => e.id == UI.updateId);
            inp.value = arr[updatedElementIndex].content;
            UI.handlePlaceholderText();
        }
        if (e.target.classList.contains("check")) {
            Actions.newArr = arr.map(e => e.id == +(parent.dataset.id) && e.checked == false ? Object.assign(Object.assign({}, e), { checked: true, date: handelDate(), time: handelTime(), text: "checked" }) : e.id == +(parent.dataset.id) && e.checked == true ? Object.assign(Object.assign({}, e), { checked: false, date: handelDate(), time: handelTime(), text: "unchecked" }) : e);
            arr = Actions.newArr;
        }
        /* add data to UI */
        Actions.checkData(arr);
        Actions.handleFilterText(arr);
        LocalStorageDATA.saveDataToLocalStorage(arr);
        if (arr.length == 0) {
            Actions.removeActiveClass();
            (_b = document.querySelector("span.all")) === null || _b === void 0 ? void 0 : _b.classList.add("active");
        }
        Actions.autoClick();
    }
    static autoClick() {
        filter[clickedFilterIndex].click();
    }
    static removeActiveClass() {
        filter.forEach(e => {
            e.classList.remove("active");
        });
    }
    static clearAll() {
        arr.splice(0);
        Actions.checkData(arr);
        UI.handlePopUp("success", "All sucessfully cleard", doneIcon);
        LocalStorageDATA.saveDataToLocalStorage(arr);
        Actions.handleFilterText(arr);
        Actions.hideOptionsCont(arr);
    }
    static displayClearAllBtn(arr) {
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
    static handleFilterText(arr) {
        let all = document.querySelector("span.all");
        let updated = document.querySelector("span.updated");
        let completed = document.querySelector("span.completed");
        let pending = document.querySelector("span.pending");
        all.innerHTML = `All(${arr.length})`;
        updated.innerHTML = `Updated(${arr.filter(e => e.text == "updated").length})`;
        completed.innerHTML = `Completed(${arr.filter(e => e.text == "checked").length})`;
        pending.innerHTML = `Pending(${arr.filter(e => e.text != "checked").length})`;
    }
    static handleFilters(e) {
        let tempArr = [];
        if (e.target.classList.contains("all")) {
            tempArr = arr;
            clickedFilterIndex = 0;
            Actions.checkData(arr);
        }
        else if (e.target.classList.contains("updated")) {
            tempArr = arr.filter(ele => ele.text == "updated");
            clickedFilterIndex = 3;
            Actions.checkData(tempArr);
        }
        else if (e.target.classList.contains("completed")) {
            tempArr = arr.filter(ele => ele.text == "checked");
            Actions.checkData(tempArr);
            clickedFilterIndex = 2;
        }
        else {
            tempArr = arr.filter(ele => ele.text != "checked");
            Actions.checkData(tempArr);
            clickedFilterIndex = 1;
        }
        Actions.checkData(tempArr);
        Actions.hideOptionsCont(arr);
    }
    static hideOptionsCont(arr) {
        if (arr.length == 0) {
            document.querySelector("#options").classList.add("hide");
        }
        else {
            document.querySelector("#options").classList.remove("hide");
        }
    }
    static checkData(arr) {
        var _a;
        if (arr.length == 0) {
            Actions.displayClearAllBtn(arr);
            UI.showData(arr);
            const div = document.createElement("div");
            div.setAttribute("class", `no-data`);
            const text = document.createTextNode(" No tasks to show ");
            div.appendChild(text);
            tasks.insertAdjacentElement("afterbegin", div);
        }
        else {
            (_a = document.querySelector(".no-data")) === null || _a === void 0 ? void 0 : _a.classList.add("hide");
            UI.showData(arr);
        }
        Actions.hideOptionsCont(arr);
    }
    static validiation() {
        if (inp.value.length > 0) {
            UI.addDataToArr();
        }
        else {
            UI.handlePopUp("danger", "add a task please !", undoneIcon);
        }
    }
}
/* prevent reloading */
form.addEventListener('submit', (e) => {
    e.preventDefault();
});
UI.handleInp();
/* get data from localstorge if there are data  */
LocalStorageDATA.getDataFromLocalStorage();
/* clicking EVENT */
btn.addEventListener('click', Actions.validiation);
tasks.addEventListener("click", Actions.actionsFn);
clear.addEventListener("click", Actions.clearAll);
inp.addEventListener("focus", () => {
    isFocus = true;
    UI.handleInp();
});
inp.addEventListener("blur", () => {
    isFocus = false;
    UI.handleInp();
    setTimeout(() => {
        inp.value = "";
    }, 400);
});
filter.forEach(ele => {
    Actions.handleFilterText(arr);
    ele.addEventListener("click", (e) => {
        Actions.removeActiveClass();
        ele.classList.add("active");
        Actions.handleFilters(e);
    });
});
