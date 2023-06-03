class Theme {
  static theme: string = localStorage.getItem("mode") || "light";
  static instance: any;

  constructor() {
    if (Theme.instance) {
      return Theme.instance;
    }
    Object.freeze(this);
  }

  saveModeTOLocalSt = (mode: string) => {
    localStorage.setItem("mode", mode);
  };

  themeClrs() {
    let clr1 = "rgb(197, 195, 195)";
    let clr2 = "rgb(9, 9, 10)";

    if (Theme.theme == "light") {
      document.documentElement.style.setProperty("--main", clr1);
      document.documentElement.style.setProperty("--secondary", clr2);
      // setTimeout(() => {
      (document.querySelector("#moon") as Element).classList.add("hide-theme");
      (document.querySelector("#sun") as Element).classList.remove(
        "hide-theme"
      );
      // }, 400);
    } else {
      // setTimeout(() => {
      (document.querySelector("#moon") as Element).classList.remove(
        "hide-theme"
      );
      (document.querySelector("#sun") as Element).classList.add("hide-theme");
      // }, 400);

      document.documentElement.style.setProperty("--main", clr2);
      document.documentElement.style.setProperty("--secondary", clr1);
    }
  }

  changeTheme(e: Event) {
    if ((e.target as HTMLElement).classList.contains("fa-sun")) {
      Theme.theme = "dark";
      this.themeClrs();

      this.saveModeTOLocalSt("dark");
    } else if ((e.target as HTMLElement).classList.contains("fa-moon")) {
      Theme.theme = "light";
      this.themeClrs();
      this.saveModeTOLocalSt("light");
    }
  }
}

let theme = new Theme();

export default theme;
