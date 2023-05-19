class Theme {
    constructor() {
        this.saveModeTOLocalSt = (mode) => {
            localStorage.setItem("mode", mode);
        };
        if (Theme.instance) {
            return Theme.instance;
        }
        Object.freeze(this);
    }
    themeClrs() {
        let clr1 = "rgb(197, 195, 195)";
        let clr2 = "rgb(9, 9, 10)";
        if (Theme.theme == "light") {
            document.documentElement.style.setProperty("--main", clr1);
            document.documentElement.style.setProperty("--secondary", clr2);
            setTimeout(() => {
                document.querySelector(".fa-moon").classList.add("hide");
                document.querySelector(".fa-sun").classList.remove("hide");
            }, 400);
        }
        else {
            setTimeout(() => {
                document.querySelector(".fa-moon").classList.remove("hide");
                document.querySelector(".fa-sun").classList.add("hide");
            }, 400);
            document.documentElement.style.setProperty("--main", clr2);
            document.documentElement.style.setProperty("--secondary", clr1);
        }
    }
    changeTheme(e) {
        if (e.target.classList.contains("fa-sun")) {
            Theme.theme = "dark";
            this.themeClrs();
            this.saveModeTOLocalSt("dark");
        }
        else if (e.target.classList.contains("fa-moon")) {
            Theme.theme = "light";
            this.themeClrs();
            this.saveModeTOLocalSt("light");
        }
    }
}
Theme.theme = localStorage.getItem("mode") || "light";
let theme = new Theme();
export default theme;
