
const inp = document.querySelector('#inp') as HTMLInputElement;
const form = document.querySelector('form') as HTMLFormElement;
const btn = document.querySelector('#btn') as HTMLButtonElement;
const clearCont = document.querySelector('#options') as HTMLButtonElement;
const clear = document.querySelector('#clr') as HTMLButtonElement;
const tasks = document.querySelector('#tasks') as HTMLElement;
const taskCont = document.querySelector(".task-cont") as HTMLElement;
const placeholder = document.querySelector("#placeholder") as HTMLElement;
const filter = document.querySelectorAll("#filters span") as NodeListOf<HTMLElement>;

// let cont= document.querySelector(".container")
let isFocus = false;
let clickedFilterIndex=0;

const doneIcon  =`<i class="fa-solid fa-check-double"></i>` as unknown as HTMLElement
const undoneIcon=`<i class="fa-solid fa-circle-xmark"></i>` as unknown as HTMLElement
for (let i = 0; i < 300; i++) {
  // let span=`<span> </span>`;
  let span = document.createElement("span")
  span.setAttribute("class", "bg-span")
  document.querySelector(".bg-cont")!.insertAdjacentElement("afterbegin", span)
}

interface DATA {
  id: number;
  content: string;
  checked: boolean;
  text: string,
  date: string,
  time: string
}

const handelTime = () => new Date().toLocaleTimeString();

const handelDate = () => new Date().toLocaleDateString();

let arr: DATA[] = [];
// let tempArr: DATA[] = [];


class TASK implements DATA {
  constructor(public id: number, public content: string, public checked: boolean
    , public text: string, public date: string, public time: string
  ) {
    this.id = id,
      this.content = content,
      this.checked = checked,
      this.text = text,
      this.date = date,
      this.time = time
  }
}

class LocalStorageDATA {
  static saveDataToLocalStorage(arr: DATA[]): void {
    localStorage.setItem("data", JSON.stringify(arr))

  }
  static getDataFromLocalStorage(): void {

    if (localStorage.data) {
      arr = JSON.parse(localStorage.data)
    }
    /* show data when reloading  */
    Actions.checkData(arr);
    UI.handleCheck(arr)
  }
}


class UI {

  static Mode: string = "create";
  static updateId: number;

  static handleCheck(arr: DATA[]) {
    let checked = document.querySelectorAll("#content p") as NodeListOf<HTMLDivElement>
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

  static showData(arr: DATA[]): void {


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

    UI.handleCheck(arr)
    Actions.displayClearAllBtn(arr)
  }

  static handleInp() {
    let placeholder = document.querySelector("form span");
    if (isFocus) {
      placeholder?.classList.add("focus")
      placeholder?.classList.remove("blur")
    } else {

      placeholder?.classList.remove("focus")
      placeholder?.classList.add("blur")

      UI.handlePlaceholderText()

    }
    UI.handleSubmitBtn();

  }
  static addDataToArr(): void {

    if (UI.Mode === "create") {

      const id = Math.random() * 100;
      const content = inp.value;
      const checked = false;
      const text = "created";
      const date = handelDate();
      const time = handelTime();
      const task = new TASK(id, content, checked, text, date, time);


      arr.unshift(task);
      Actions.checkData(arr)
      UI.handlePopUp("success", "task sucessfully added !",doneIcon)
    } else {
      Actions.newArr = arr.map((ele: DATA) => {
        return +(ele.id) === UI.updateId ?
          {
            ...ele,
            content: inp.value,
            date: handelDate(),
            time: handelTime(),
            text: "updated",
            checked: false
          } : ele
      })
      arr = Actions.newArr
      UI.showData(arr);

      UI.Mode = "create"

      UI.handlePopUp("success", "task sucessfully updated !",doneIcon)
    }
    inp.value = '';
    LocalStorageDATA.saveDataToLocalStorage(arr);
    UI.handlePlaceholderText();
    UI.handleSubmitBtn();
    Actions.handleFilterText(arr);   
Actions.hideOptionsCont(arr) 
   Actions.autoClick()

  }

  static handlePlaceholderText() {

    if (UI.Mode === "create") {
      placeholder.innerHTML = "add a task .."
    } else {
      placeholder.innerHTML = "update task .."
    }

  }

  static handleSubmitBtn() {
    btn.innerHTML = UI.Mode === "create" ? "add tasks" : "update";
  }
  static handlePopUp(clr: string, msg: string,icon:HTMLElement): void {
    // const pop = `<div class='pop ${clearCont}'>${msg}</div>` as Element  ;
    const div = document.createElement("span") as Element;
    div.setAttribute("class", `pop ${clr}`)
    // const text = document.createTextNode(msg)
    // div.appendChild(text)
    div.innerHTML=`${icon} ${msg}`
    let parent: Element | null = document.querySelector(".pop-cont")
    parent!.insertAdjacentElement("afterbegin", div)
    let popUps = document.querySelectorAll(".pop")
    popUps.forEach(ele => {
      setTimeout(() => {
        ele?.remove();
      }, 4000);
    })


  }

}





class Actions {
  static newArr: DATA[];

  static actionsFn(e: MouseEvent): void {

    const parent = (e.target as HTMLElement).parentElement?.parentElement as HTMLElement

    if ((e.target as HTMLElement).classList.contains("del")) {
   
      
      Actions.newArr = arr.filter((ele: DATA) => + (ele.id) !== + (parent.dataset.id!))
      arr = Actions.newArr
      UI.handlePopUp("success", "task sucessfully deleted" ,doneIcon)
      Actions.checkData(arr);

    }


    if ((e.target as HTMLElement).classList.contains("update")) {

      inp.value = "";
      UI.Mode = "update"


      inp.focus();
      UI.updateId = +parent.dataset.id!;

      let updatedElementIndex: number = arr.findIndex(e => e.id == UI.updateId)

      inp.value = arr[updatedElementIndex].content
      UI.handlePlaceholderText();
    }

    if ((e.target as HTMLElement).classList.contains("check")) {


      Actions.newArr = arr.map(e => e.id == + (parent.dataset.id!) && e.checked == false ?
        { ...e, checked: true, date: handelDate(), time: handelTime(), text: "checked" } : e.id == + (parent.dataset.id!) && e.checked == true ?
          { ...e, checked: false, date: handelDate(), time: handelTime(), text: "unchecked" } : e)
      arr = Actions.newArr

    }
    /* add data to UI */
    Actions.checkData(arr);
    Actions.handleFilterText(arr)
    LocalStorageDATA.saveDataToLocalStorage(arr);

    if(arr.length==0){

      Actions.removeActiveClass()
      document.querySelector("span.all")?.classList.add("active")
    }
    Actions.autoClick()

  }
  static autoClick(){
    filter![clickedFilterIndex].click()
  }
  static removeActiveClass() {
    filter.forEach(e => {
      e.classList.remove("active")
    })
  }
  static clearAll() {
    arr.splice(0);
    Actions.checkData(arr);
    UI.handlePopUp("success", "All sucessfully cleard" ,doneIcon)
    LocalStorageDATA.saveDataToLocalStorage(arr);
    Actions.handleFilterText(arr);
  Actions.hideOptionsCont(arr)


  }

  static displayClearAllBtn(arr: DATA[]) {
   if (arr.length < 2) {
      clear.classList.add("hide")
      clear.classList.remove("block")
    } else if (arr.length >= 2) {
      clear.classList.remove("hide")
      clear.classList.add("block")
    }

    clear.innerHTML = `Clear All (${arr.length})`
  }
  static handleFilterText(arr: DATA[]): void {

    let all = document.querySelector("span.all")
    let updated = document.querySelector("span.updated")
    let completed = document.querySelector("span.completed")
    let pending = document.querySelector("span.pending")

    all!.innerHTML = `All(${arr.length})`
    updated!.innerHTML = `Updated(${arr.filter(e => e.text == "updated").length})`
    completed!.innerHTML = `Completed(${arr.filter(e => e.text == "checked").length})`
    pending!.innerHTML = `Pending(${arr.filter(e => e.text != "checked").length})`
  }

  static handleFilters(e: Event) {
    
    let tempArr:DATA[]=[];
    if ((e.target as HTMLElement).classList.contains("all")) {
      tempArr=arr
      clickedFilterIndex =0
      Actions.checkData(arr)
    } else if ((e.target as HTMLElement).classList.contains("updated")) {
      tempArr = arr.filter(ele => ele.text == "updated")
      clickedFilterIndex=3

      Actions.checkData(tempArr)
    } else if ((e.target as HTMLElement).classList.contains("completed")) {
      tempArr = arr.filter(ele => ele.text == "checked")
      Actions.checkData(tempArr)
      clickedFilterIndex=2

    } else {
      tempArr = arr.filter(ele => ele.text != "checked")
      Actions.checkData(tempArr)
      clickedFilterIndex=1
    }
    Actions.checkData(tempArr)
    Actions.hideOptionsCont(arr)

  }

  static hideOptionsCont(arr:DATA[]){
    if (arr.length == 0) {
      document.querySelector("#options")!.classList.add("hide")
    } else{
      document.querySelector("#options")!.classList.remove("hide")

    }
  }
  static checkData(arr: DATA[]) {
    if (arr.length == 0) {
      Actions.displayClearAllBtn(arr)
      UI.showData(arr);

      const div = document.createElement("div") as HTMLDivElement;
      div.setAttribute("class", `no-data`)
  
      div.innerHTML= `No ${filter![clickedFilterIndex].dataset.state}tasks to show`
      tasks!.insertAdjacentElement("afterbegin", div)

    } else {
      document.querySelector(".no-data")?.classList.add("hide");

      UI.showData(arr);
    }
    Actions.hideOptionsCont(arr)

  }

  static validiation() {
    if (inp.value.length > 0) {
      UI.addDataToArr();

    } else {
      UI.handlePopUp("danger", "add a task please !",undoneIcon)
    }

  }
}

/* prevent reloading */
form.addEventListener('submit', (e) => {
  e.preventDefault();
});

UI.handleInp();



/* get data from localstorge if there are data  */
LocalStorageDATA.getDataFromLocalStorage()

/* clicking EVENT */
btn.addEventListener('click', Actions.validiation);


tasks.addEventListener("click", Actions.actionsFn)


clear.addEventListener("click", Actions.clearAll);


inp.addEventListener("focus", () => {
  isFocus = true;
  UI.handleInp()
})
inp.addEventListener("blur", () => {
  isFocus = false;
  UI.handleInp();
  setTimeout(() => {
    inp.value = "";
    UI.Mode="create";
    UI.handlePlaceholderText()
    UI.handleSubmitBtn()
  }, 400);


})


filter.forEach(ele => {
  Actions.handleFilterText(arr);
  ele.addEventListener("click", (e) => {
    Actions.removeActiveClass();
    ele.classList.add("active");
    Actions.handleFilters(e);

  })


})
