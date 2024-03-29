import { btn } from "../index.js";
import { action, Mode, tasks } from "./Actions.js";
export const placeholder = document.querySelector("#placeholder");
class UI {
    constructor() {
        if (UI.instance) {
            return UI.instance;
        }
        Object.freeze(this);
        UI.instance = this;
    }
    handleCheck(arr) {
        let checked = document.querySelectorAll("#content p");
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].checked == true) {
                checked[i].classList.add("checked");
            }
            else {
                checked[i].classList.remove("checked");
            }
        }
    }
    showData(arr) {
        tasks.innerHTML = "";
        for (let i = 0; i < arr.length; i++) {
            tasks.innerHTML += `
      <div class="task ${arr[i].text} ${localStorage.getItem("iscreated") && i == 0 ? "task-created" : null}"

   data-id=${arr[i].id}>
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
<i  title="del" class="fa-solid fa-x fa-sm del"></i>
<div class="arrows">
<i class="fa-solid up  fa-circle-up"></i>
<i class="fa-solid down  fa-circle-down"></i>
</div>
</div>
</div>`;
        }
        this.handleCheck(arr);
        action.displayClearAllBtn(arr);
        this.handleSubmitBtn();
    }
    handlePlaceholderText() {
        if (Mode === "create") {
            placeholder.innerHTML = "add a task ..";
        }
        else {
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
    handlePopUp(clr, msg, icon) {
        // const pop = `<div class='pop ${clearCont}'>${msg}</div>` as Element  ;
        const div = document.createElement("span");
        div.setAttribute("class", `pop ${clr}`);
        div.innerHTML = `${icon} ${msg}`;
        let parent = document.querySelector(".pop-cont");
        parent.insertAdjacentElement("afterbegin", div);
        let popUps = document.querySelectorAll(".pop");
        popUps.forEach((ele) => {
            setTimeout(() => {
                ele === null || ele === void 0 ? void 0 : ele.remove();
            }, 5000);
        });
    }
}
export const ui = new UI();
