import { btn } from "../index.js";
import { action, DATA, Mode, tasks } from "./Actions.js";
export const placeholder = document.querySelector(
  "#placeholder"
) as HTMLElement;

class UI {
  static instance: any;

  constructor() {
    if (UI.instance) {
      return UI.instance;
    }
    Object.freeze(this);
    UI.instance = this;
  }
  handleCheck(arr: DATA[]) {
    let checked = document.querySelectorAll(
      "#content p"
    ) as NodeListOf<HTMLDivElement>;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].checked == true) {
        console.log("checked");

        checked[i].classList.add("checked");
        console.log(checked[i]);
      } else {
        checked[i].classList.remove("checked");
      }
    }
  }

  showData(arr: DATA[]): void {
    tasks.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
      tasks.innerHTML += `
      <div class="task ${arr[i].text} ${
        localStorage.getItem("iscreated") && i == 0 ? "task-created" : null
      }"

   data-id=${arr[i].id}>
      <div id=content >
      <p id="content"  >${arr[i].content}</p></div>
      <div id="time">
      <span  class="text ${arr[i].text}">${arr[i].text} in</span>
      <span class="time"  >Time : ${arr[i].time}</span>
      <span class="date"  ><span style="color:black">&&</span> Date : ${
        arr[i].date
      }</span>
      
      </div>
<div id="btns">
<i title="update" class="fa-solid fa-pen-to-square fa-sm update"></i>
<i title="check"  class="fa fa-check fa-sm check " aria-hidden="true"></i>
<i  title="del" class="fa-solid fa-x fa-sm del"></i></div>
</div>`;
    }

    this.handleCheck(arr);
    action.displayClearAllBtn(arr);
    this.handleSubmitBtn();
  }

  handlePlaceholderText() {
    if (Mode === "create") {
      placeholder.innerHTML = "add a task ..";
    } else {
      placeholder.innerHTML = "update task ..";
    }
  }

  handleSubmitBtn() {
    let updateIcon = `<div class="updateIcon">
    <i class="fa-solid fa-arrow-right-arrow-left"></i></div>`;
    let createIcon = `<div class="createIcon"><i class="fa-solid fa-arrow-right-to-bracket"></i></div>`;
    btn.innerHTML =
      Mode === "create" ? `add tasks ${createIcon}` : `update ${updateIcon}`;
  }

  handlePopUp(clr: string, msg: string, icon: HTMLElement): void {
    // const pop = `<div class='pop ${clearCont}'>${msg}</div>` as Element  ;
    const div = document.createElement("span") as Element;
    div.setAttribute("class", `pop ${clr}`);

    div.innerHTML = `${icon} ${msg}`;
    let parent: Element | null = document.querySelector(".pop-cont");
    parent!.insertAdjacentElement("afterbegin", div);
    let popUps = document.querySelectorAll(".pop");
    popUps.forEach((ele) => {
      setTimeout(() => {
        ele?.remove();
      }, 4500);
    });
  }
}

export const ui = new UI();
