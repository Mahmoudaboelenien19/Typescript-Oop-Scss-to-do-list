import { action, arr, clear, filter, inp, tasks } from "./classes/Actions.js";
import local from "./classes/localStorage.js";
import { ui } from "./classes/UI.js";
const form = document.querySelector("form") as HTMLFormElement;

export const btn = document.querySelector("#btn") as HTMLButtonElement;

for (let i = 0; i < 300; i++) {
  let span = document.createElement("span");
  span.setAttribute("class", "bg-span");
  document.querySelector(".bg-cont")!.insertAdjacentElement("afterbegin", span);
}

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
  ui.handlePlaceholderText();
  ui.handleSubmitBtn();
  // action.resetMode();
});

filter.forEach((ele) => {
  action.handleFilterText(arr);
  ele.addEventListener("click", (e) => {
    action.removeActiveClass();
    ele.classList.add("active");
    action.handleFilters(e);
  });
});
