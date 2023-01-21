import { TASK } from "./Task.js";

import local from "./localStorage.js";
import { ui } from "./UI.js";
export const inp = document.querySelector("#inp") as HTMLInputElement;
export const clear = document.querySelector("#clr") as HTMLButtonElement;
export const clearPopCont = document.querySelector(
  ".pop-del-cont "
) as HTMLElement;
export const clearPopup = document.querySelector(".pop-del ") as HTMLElement;
const clrPopBtn = document.querySelector(".clr-pop") as HTMLButtonElement;

const cancel = document.querySelector(".cancel") as HTMLButtonElement;
export const tasks = document.querySelector("#tasks") as HTMLElement;
export const filter = document.querySelectorAll(
  "#filters span"
) as NodeListOf<HTMLElement>;

const doneIcon =
  `<i class="fa-solid fa-check-double"></i>` as unknown as HTMLElement;
const undoneIcon =
  `<i class="fa-solid fa-circle-xmark"></i>` as unknown as HTMLElement;

export let newArr: DATA[];
export let updateId: number;
export let clickedFilterIndex = 0;

export let Mode: string = "create";

export interface DATA {
  id: number;
  content: string;
  checked: boolean;
  text: string;
  date: string;
  time: string;
}

export let arr: DATA[] = [];

const handelTime = () => new Date().toLocaleTimeString();

export const handelDate = () => new Date().toLocaleDateString();

class Actions {
  static instance: any;
  constructor() {
    if (Actions.instance) {
      return Actions.instance;
    }
    Object.freeze(this);
    Actions.instance = this;
  }

  addDataToArr(): void {
    console.log("2 ", Mode);

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
    } else {
      newArr = arr.map((ele: DATA) => {
        return +ele.id === updateId
          ? {
              ...ele,
              content: inp.value,
              date: handelDate(),
              time: handelTime(),
              text: "updated",
              checked: false,
            }
          : ele;
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
    this.removeInpBorder();
    inp.focus();
  }

  actionFn(e: MouseEvent): void {
    const parent = (e.target as HTMLElement).parentElement
      ?.parentElement as HTMLElement;

    if ((e.target as HTMLElement).classList.contains("del")) {
      (e.target as HTMLElement).classList.add("deleted");

      const deleted = arr.find(
        (e) => +e.id == +parent.dataset.id!
      ) as unknown as Element;
      console.log(deleted);
      console.log(deleted!.id);

      document.getElementById(deleted!.id)?.classList.add("deleted");
      console.log(document.getElementById(deleted!.id));
      (document.querySelectorAll(".task") as NodeListOf<HTMLElement>).forEach(
        (e) => {
          e.dataset.id! == deleted!.id ? e.classList.add("task-deleted") : null;
          console.log(e);
        }
      );

      ui.handlePopUp("success", "task sucessfully deleted", doneIcon);

      newArr = arr.filter((ele: DATA) => +ele.id !== +parent.dataset.id!);
      arr = newArr;
      local.saveDataToLocalStorage(arr);
      setTimeout(() => {
        this.checkData(arr);
        this.handleFilterText(arr);
        if (arr.length == 0) {
          this.removeActiveClass();
          document.querySelector("span.all")?.classList.add("active");
        }
        this.autoClick();
      }, 1000);
    }

    if ((e.target as HTMLElement).classList.contains("update")) {
      Mode = "update";
      inp.value = "";
      inp.focus();

      updateId = +parent.dataset.id!;

      let updatedElementIndex: number = arr.findIndex((e) => e.id == updateId);

      inp.value = arr[updatedElementIndex].content;
      ui.handlePlaceholderText();
      ui.handleSubmitBtn();
      console.log("1" + Mode);
      this.checkData(arr);
      local.saveDataToLocalStorage(arr);

      this.autoClick();
      this.handleFilterText(arr);
    }

    if ((e.target as HTMLElement).classList.contains("check")) {
      newArr = arr.map((e) =>
        e.id == +parent.dataset.id! && e.checked == false
          ? {
              ...e,
              checked: true,
              date: handelDate(),
              time: handelTime(),
              text: "checked",
            }
          : e.id == +parent.dataset.id! && e.checked == true
          ? {
              ...e,
              checked: false,
              date: handelDate(),
              time: handelTime(),
              text: "unchecked",
            }
          : e
      );
      arr = newArr;
      this.checkData(arr);
      local.saveDataToLocalStorage(arr);
      this.autoClick();
    }

    this.handleFilterText(arr);

    // this.checkData(arr);
    // local.saveDataToLocalStorage(arr);
    // this.autoClick();

    if (arr.length == 0) {
      this.removeActiveClass();
      document.querySelector("span.all")?.classList.add("active");
    }
  }

  autoClick() {
    filter![clickedFilterIndex].click();
  }
  removeActiveClass() {
    filter.forEach((e) => {
      e.classList.remove("active");
    });
  }
  handleClearAllPop() {
    clearPopCont.classList.remove("hide");
  }

  clearAll() {
    arr.splice(0);
    this.checkData(arr);
    ui.handlePopUp("success", "All sucessfully cleard", doneIcon);
    local.saveDataToLocalStorage(arr);
    this.handleFilterText(arr);
    this.hideOptionsCont(arr);
  }
  hideClrPop() {
    clearPopCont.classList.add("hide");
    clearPopup.classList.remove("hide");
  }

  handleClearing(e: Event) {
    if ((e.target as HTMLElement).classList.contains("clr-pop")) {
      this.clearAll();
      this.hideClrPop();
    } else if ((e.target as HTMLElement).classList.contains("cancel")) {
      clearPopup.classList.add("hide");

      this.hideClrPop();
    }
  }

  displayClearAllBtn(arr: DATA[]) {
    if (arr.length < 2) {
      clear.classList.add("hide");
      clear.classList.remove("block");
    } else if (arr.length >= 2) {
      clear.classList.remove("hide");
      clear.classList.add("block");
    }

    clear.innerHTML = `Clear All (${arr.length})`;
  }

  handleFilterText(arr: DATA[]): void {
    let all = document.querySelector("span.all");
    let updated = document.querySelector("span.updated");
    let completed = document.querySelector("span.completed");
    let pending = document.querySelector("span.pending");

    all!.innerHTML = `All(${arr.length})`;
    updated!.innerHTML = `Updated(${
      arr.filter((e) => e.text == "updated").length
    })`;
    completed!.innerHTML = `Completed(${
      arr.filter((e) => e.text == "checked").length
    })`;
    pending!.innerHTML = `Pending(${
      arr.filter((e) => e.text != "checked").length
    })`;
  }

  handleFilters(e: Event) {
    let tempArr: DATA[] = [];
    if ((e.target as HTMLElement).classList.contains("all")) {
      tempArr = arr;
      clickedFilterIndex = 0;
      this.checkData(arr);
    } else if ((e.target as HTMLElement).classList.contains("updated")) {
      tempArr = arr.filter((ele) => ele.text == "updated");
      clickedFilterIndex = 3;

      this.checkData(tempArr);
    } else if ((e.target as HTMLElement).classList.contains("completed")) {
      tempArr = arr.filter((ele) => ele.text == "checked");
      this.checkData(tempArr);
      clickedFilterIndex = 2;
    } else {
      tempArr = arr.filter((ele) => ele.text != "checked");
      this.checkData(tempArr);
      clickedFilterIndex = 1;
    }
    this.checkData(tempArr);
    this.hideOptionsCont(arr);
  }

  hideOptionsCont(arr: DATA[]) {
    if (arr.length == 0) {
      document.querySelector("#options")!.classList.add("hide");
    } else {
      document.querySelector("#options")!.classList.remove("hide");
    }
  }

  checkData(arr: DATA[]) {
    if (arr.length == 0) {
      this.displayClearAllBtn(arr);

      ui.showData(arr);
      const div = document.createElement("div") as HTMLDivElement;
      div.setAttribute("class", `no-data`);

      div.innerHTML = `No ${
        filter![clickedFilterIndex].dataset.state
      }tasks to show`;
      tasks!.insertAdjacentElement("afterbegin", div);
    } else {
      document.querySelector(".no-data")?.classList.add("hide");
      ui.showData(arr);
    }
    this.hideOptionsCont(arr);
  }

  validiation() {
    if (inp.value.length === 0) {
      ui.handlePopUp("danger", "add a task please !", undoneIcon);
    } else if (inp.value.length >= 1 && inp.value.length <= 24) {
      this.addDataToArr();
    } else {
      ui.handlePopUp("danger", "you can't exceed 25 letters", undoneIcon);
    }
  }

  handleInpBorder(e: Event) {
    if (inp.value.length === 0) {
      this.removeInpBorder();
    } else if (inp.value.length < 25 && inp.value.length >= 1) {
      inp.classList.add("valid");
      inp.classList.remove("invalid");
    } else {
      inp.classList.add("invalid");
      inp.classList.remove("valid");
    }
  }

  removeInpBorder() {
    if (inp.value.length === 0) {
      inp.classList.remove("valid");
      inp.classList.remove("invalid");
    }
  }

  resetMode() {
    Mode = "create";
  }

  handleeCreatedClass() {
    const tasksAdded = document.querySelector(
      ".task"
    ) as unknown as NodeListOf<HTMLElement>;
    tasksAdded.forEach((e) => e.classList.remove("created"));
  }
  // tasksAdded[0].classList.add("created")
}

export const action = new Actions();
