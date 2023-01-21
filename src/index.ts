import { action, arr, clear, filter, inp, tasks } from "./classes/Actions.js";
import local from "./classes/localStorage.js";
import { ui } from "./classes/UI.js";
const form = document.querySelector("form") as HTMLFormElement;

export const btn = document.querySelector("#btn") as HTMLButtonElement;
const modeCont = document.querySelector("#mode ") as unknown as HTMLElement;

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
  // action.resetMode();
  /* *FIXME - 
  * when i have update mode and make inp blur 
  it still on update mode
  *i want to make at blur to be at create mode 
  */
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

    document.body.classList.toggle("light");
    (e.target as HTMLElement).classList.toggle("light");

    (document.querySelector(".fa-gear") as Element).classList.toggle("light");
    (e.target as HTMLElement).classList.toggle("light");

    (document.querySelectorAll(".bg-span") as NodeListOf<HTMLElement>).forEach(
      (e) => e.classList.toggle("light")
    );

    if (mode == "light") {
      document.documentElement.style.setProperty("--main", clr1);
      document.documentElement.style.setProperty("--secondary", clr2);
    } else {
      document.documentElement.style.setProperty("--main", clr2);
      document.documentElement.style.setProperty("--secondary", clr1);
    }
  }
});
