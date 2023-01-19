import { DATA } from "./../index.js";
export class TASK implements DATA {
  constructor(
    public id: number,
    public content: string,
    public checked: boolean,
    public text: string,
    public date: string,
    public time: string
  ) {
    (this.id = id),
      (this.content = content),
      (this.checked = checked),
      (this.text = text),
      (this.date = date),
      (this.time = time);
  }
}
