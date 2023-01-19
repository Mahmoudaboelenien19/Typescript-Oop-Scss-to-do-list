export class TASK {
    constructor(id, content, checked, text, date, time) {
        this.id = id;
        this.content = content;
        this.checked = checked;
        this.text = text;
        this.date = date;
        this.time = time;
        (this.id = id),
            (this.content = content),
            (this.checked = checked),
            (this.text = text),
            (this.date = date),
            (this.time = time);
    }
}
