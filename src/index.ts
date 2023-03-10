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
import { ui } from "./classes/UI.js";

const form = document.querySelector("form") as HTMLFormElement;

export const btn = document.querySelector("#btn") as HTMLButtonElement;
const modeCont = document.querySelector("#mode ") as HTMLElement;

window.addEventListener("load", () => {
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

/* get data from localstorge if there are data  */
local.getDataFromLocalStorage();

/* clicking EVENT */
btn.addEventListener("click", action.validiation.bind(action));

tasks.addEventListener("click", action.actionFn.bind(action));
//  action.clearAll.bind(action)
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

modeCont.addEventListener("click", (e: Event) => {
  if ((e.target as HTMLElement).classList.contains("fa-gear")) {
    let mode: string = "light";
    let clr1 = "rgb(197, 195, 195)";
    let clr2 = "rgb(9, 9, 10)";
    if ((e.target as HTMLElement).classList.contains("light")) {
      mode = "dark";
    }

    document.documentElement.style.setProperty(
      "--mode-icon-title-display",
      "none"
    );
    setTimeout(() => {
      document.documentElement.style.setProperty(
        "--mode-icon-title-display",
        "block"
      );
    }, 1000);

    document.body.classList.toggle("light");
    (e.target as HTMLElement).classList.toggle("light");

    (document.querySelector(".fa-gear") as Element).classList.toggle("light");
    (e.target as HTMLElement).classList.toggle("light");
    document.documentElement.style.setProperty("--mode-icon-title-pos", "0");

    (document.querySelectorAll(".bg-span") as NodeListOf<HTMLElement>).forEach(
      (e) => e.classList.toggle("light")
    );

    if (mode == "light") {
      (document.querySelector("#title") as Element).innerHTML =
        "apply dark mode";
      document.documentElement.style.setProperty("--main", clr1);
      document.documentElement.style.setProperty("--secondary", clr2);
    } else {
      (document.querySelector("#title") as Element).innerHTML =
        "apply light mode";
      document.documentElement.style.setProperty("--main", clr2);
      document.documentElement.style.setProperty("--secondary", clr1);
      document.documentElement.style.setProperty(
        "--mode-icon-title-pos",
        " calc(100% - 20px)"
      );
    }
  }
});

clearPopup.addEventListener("click", action.handleClearing.bind(action));

inp.addEventListener("change", () => {
  if (inp.value == "") {
    action.resetMode();
  }
});
