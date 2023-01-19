import { action } from "./classes/Actions.js";
import local from "./classes/localStorage.js";
import { ui } from "./classes/UI.js";
export const inp = document.querySelector("#inp");
const form = document.querySelector("form");
export const btn = document.querySelector("#btn");
export const clear = document.querySelector("#clr");
export const tasks = document.querySelector("#tasks");
export const placeholder = document.querySelector("#placeholder");
export const filter = document.querySelectorAll("#filters span");
export const doneIcon = `<i class="fa-solid fa-check-double"></i>`;
export const undoneIcon = `<i class="fa-solid fa-circle-xmark"></i>`;
for (let i = 0; i < 300; i++) {
    // let span=`<span> </span>`;
    let span = document.createElement("span");
    span.setAttribute("class", "bg-span");
    document.querySelector(".bg-cont").insertAdjacentElement("afterbegin", span);
}
export const handelTime = () => new Date().toLocaleTimeString();
export const handelDate = () => new Date().toLocaleDateString();
export let arr = [];
/* prevent reloading */
form.addEventListener("submit", (e) => {
    e.preventDefault();
});
/* get data from localstorge if there are data  */
local.getDataFromLocalStorage();
/* clicking EVENT */
btn.addEventListener("click", action.validiation.bind(action));
tasks.addEventListener("click", action.actionFn.bind(action));
clear.addEventListener("click", action.clearAll.bind(action));
inp.addEventListener("blur", () => {
    action.resetMode();
    ui.handlePlaceholderText();
    ui.handleSubmitBtn();
});
filter.forEach((ele) => {
    action.handleFilterText(arr);
    ele.addEventListener("click", (e) => {
        action.removeActiveClass();
        ele.classList.add("active");
        action.handleFilters(e);
    });
});
