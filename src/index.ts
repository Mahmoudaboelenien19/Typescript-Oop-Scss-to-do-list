import {
  action,
  arr,
  clear,
  clearPopup,
  filter,
  inp,
  tasks,
} from "./classes/Actions.js";
import local from "./classes/localStorage.js";
import theme from "./classes/Theme.js";
import { ui } from "./classes/UI.js";

const form = document.querySelector("form") as HTMLFormElement;

export const btn = document.querySelector("#btn") as HTMLButtonElement;
const modeCont = document.querySelector("#mode ") as HTMLElement;
const moon = document.querySelector("#mode  .fa-moon") as HTMLElement;
const sun = document.querySelector("#mode .fa-sun") as HTMLElement;

window.addEventListener("DOMContentLoaded", () => {
  theme.themeClrs();

  setTimeout(() => {
    document.querySelector(".loading")?.classList.add("hide");
    document.querySelector(".container")?.classList.remove("hide");
  }, 5000);
});

for (let i = 0; i < 400; i++) {
  let span = document.createElement("span");
  span.setAttribute("class", "bg-span");
  document.querySelector(".bg-cont")!.insertAdjacentElement("afterbegin", span);
}

/* prevent reloading */
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

local.getDataFromLocalStorage();

btn.addEventListener("click", action.validiation.bind(action));

tasks.addEventListener("click", action.actionFn.bind(action));

clear.addEventListener("click", action.handleClearAllPop);

filter.forEach((ele) => {
  action.handleFilterText(arr);
  ele.addEventListener("click", (e) => {
    action.removeActiveClass();
    ele.classList.add("active");
    action.handleFilters(e);
  });
});

inp.addEventListener("blur", () => {
  ui.handlePlaceholderText();
  ui.handleSubmitBtn();
  action.removeInpBorder();
});

inp.addEventListener("input", action.handleInpBorder.bind(action));

modeCont.addEventListener("click", theme.changeTheme.bind(theme));

clearPopup.addEventListener("click", action.handleClearing.bind(action));

inp.addEventListener("change", () => {
  if (inp.value == "") {
    action.resetMode();
  }
});
