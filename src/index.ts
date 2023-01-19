import { action } from "./classes/Actions.js";
import local from "./classes/localStorage.js";
import { ui } from "./classes/UI.js";
export const inp = document.querySelector("#inp") as HTMLInputElement;
const form = document.querySelector("form") as HTMLFormElement;
export const btn = document.querySelector("#btn") as HTMLButtonElement;
export const clear = document.querySelector("#clr") as HTMLButtonElement;
export const tasks = document.querySelector("#tasks") as HTMLElement;
export const placeholder = document.querySelector(
  "#placeholder"
) as HTMLElement;

export const filter = document.querySelectorAll(
  "#filters span"
) as NodeListOf<HTMLElement>;

export const doneIcon =
  `<i class="fa-solid fa-check-double"></i>` as unknown as HTMLElement;
export const undoneIcon =
  `<i class="fa-solid fa-circle-xmark"></i>` as unknown as HTMLElement;
for (let i = 0; i < 300; i++) {
  // let span=`<span> </span>`;
  let span = document.createElement("span");
  span.setAttribute("class", "bg-span");
  document.querySelector(".bg-cont")!.insertAdjacentElement("afterbegin", span);
}
export interface DATA {
  id: number;
  content: string;
  checked: boolean;
  text: string;
  date: string;
  time: string;
}

export const handelTime = () => new Date().toLocaleTimeString();

export const handelDate = () => new Date().toLocaleDateString();

export let arr: DATA[] = [];

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
