
const inp = document.querySelector('#inp') as HTMLInputElement;
const form = document.querySelector('form') as HTMLFormElement;
const btn = document.querySelector('#btn') as HTMLButtonElement;
const clr = document.querySelector('#clr') as HTMLButtonElement;
const tasks = document.querySelector('#tasks') as HTMLElement;
const taskCont = document.querySelector(".task-cont") as HTMLElement;


// let cont= document.querySelector(".container")
let isFocus=false;



for(let i=0;i<300;i++){
    // let span=`<span> </span>`;
    let span=document.createElement("span")
    span.setAttribute("class","bg-span")
  document.querySelector(".bg-cont")!.insertAdjacentElement("afterbegin",span)
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
<div class="btns">
<i title="update" class="fa-solid fa-pen-to-square fa-sm update"></i>
<i title="check"  class="fa fa-check fa-sm check " aria-hidden="true"></i>
<i  title="del" class="fa-solid fa-x fa-sm del"></i></div>
</div>`;


    }

    UI.handleCheck(arr)
    Actions.displayClearAllBtn(arr)
    LocalStorageDATA.saveDataToLocalStorage(arr);
  }

  static handleInp(){
    let placeholder=document.querySelector("form span")
    if(isFocus){
      placeholder?.classList.add("focus")
      placeholder?.classList.remove("blur")
    }else{
      
      placeholder?.classList.remove("focus")
      placeholder?.classList.add("blur")

    }

  }
  static addDataToArr(): void {

    if (UI.Mode === "create") {

      const id = Math.random() * 100;
      const content = inp.value
      const checked = false
      const text = "created"
      const date = handelDate()
      const time = handelTime()


      const task = new TASK(id, content, checked, text, date, time);


      arr.unshift(task);

      Actions.checkData(arr)



      UI.handlePopUp("success", "task added !")
    } else {

      Actions.newArr = arr.map((ele: DATA) => {
        return +(ele.id) === UI.updateId ?
          {
            ...ele,
            content: inp.value,
            date: handelDate(),
             time: handelTime(),
             text:"updated",
             checked:false
          } : ele
      })
      arr = Actions.newArr
      UI.showData(arr);

      UI.Mode = "create"
      btn.innerHTML = 'Add tasks'
      UI.handlePopUp("success", "task updated !")
    }
    inp.value = '';
   
  }


  static handlePopUp(clr: string, msg: string): void {
    // const pop = `<div class='pop ${clr}'>${msg}</div>` as Element  ;
    const div = document.createElement("div") as Element;
    div.setAttribute("class", `pop ${clr}`)
    const text = document.createTextNode(msg)
    div.appendChild(text)
    let parent: Element | null = document.querySelector(".pop-cont")
    parent!.insertAdjacentElement("afterbegin", div)
    let popUps = document.querySelectorAll(".pop")
    popUps.forEach(ele => {
      setTimeout(() => {
        ele?.remove();
      }, 2000);
    })


  }

}





class Actions {
  static newArr: DATA[];

  static actionsFn(e: MouseEvent): void {
    //  console.log(e.target);

    const parent = (e.target as HTMLElement).parentElement?.parentElement as HTMLElement


    if ((e.target as HTMLElement).classList.contains("del")) {

      Actions.newArr = arr.filter((ele: DATA) => + (ele.id) !== + (parent.dataset.id!))
      arr = Actions.newArr
UI.handlePopUp("success","deleted")
Actions.checkData(arr)
    }


    if ((e.target as HTMLElement).classList.contains("update")) {

      inp.value = "";

      UI.Mode = "update"
      btn.innerHTML = 'Update'

      inp.focus();
      UI.updateId = +parent.dataset.id!;

      let updatedElementIndex: number = arr.findIndex(e => e.id == UI.updateId)

      inp.value = arr[updatedElementIndex].content
    }
    if ((e.target as HTMLElement).classList.contains("check")) {


      Actions.newArr = arr.map(e => e.id == + (parent.dataset.id!) && e.checked == false ?
        { ...e, checked: true, date: handelDate(), time: handelTime() , text:"checked"} : e.id == + (parent.dataset.id!) && e.checked == true ?
          { ...e, checked: false , date: handelDate(), time: handelTime() , text:"unchecked" } : e)

      arr = Actions.newArr

      // UI.handleCheck(arr);

    }


    /* add data to UI */
    UI.showData(arr);


  }

  static clearAll() {
    arr.splice(0);
    Actions.checkData(arr);
    UI.handlePopUp("danger", "All cleard")

  }

  static displayClearAllBtn(arr: DATA[]) {

    if (arr.length <= 1) {
      clr.classList.add("hide")
      clr.classList.remove("block")
    } else if (arr.length > 1) {
      clr.classList.remove("hide")
      clr.classList.add("block")
    }

    clr.innerHTML = `Clear All (${arr.length})`
  }


  static checkData(arr: DATA[]) {

    if (arr.length == 0) {
      Actions.displayClearAllBtn(arr)
      UI.showData(arr);

      const div = document.createElement("div") as HTMLDivElement;
      div.setAttribute("class", `no-data`)
      const text = document.createTextNode(" No tasks to show ")
      div.appendChild(text)
      taskCont!.insertAdjacentElement("afterbegin", div)

    } else {
      document.querySelector(".no-data")?.classList.add("hide");

      UI.showData(arr);
    }


  }

  static validiation() {
    if (inp.value.length > 0) {
      UI.addDataToArr();
    } else {
      UI.handlePopUp("danger", "add a task !")
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


clr.addEventListener("click", Actions.clearAll);


inp.addEventListener("focus",()=>{
  isFocus=true;
  UI.handleInp()
})
inp.addEventListener("blur",()=>{
  isFocus=false;
  UI.handleInp()

})