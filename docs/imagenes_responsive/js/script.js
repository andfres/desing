const menu = document.getElementById("menu");
const nav = document.querySelector("nav");

window.matchMedia("(min-width: 700px)").addListener(ocultar);


function ocultar(x) {

    if (x.matches) {
        menu.classList.add("oculto");
        nav.classList.remove("oculto");

    } else {
        menu.classList.remove("oculto");
        nav.classList.add("oculto");
    }
}