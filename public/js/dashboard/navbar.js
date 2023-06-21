// sidenav transition-burger
export function sidebarToggle() {
  var sidenav = document.querySelector("sidebar");
  var sidenav_trigger = document.querySelector("[sidenav-trigger]");
  var sidenav_close_button = document.querySelector("[sidenav-close]");
  var burger = sidenav_trigger.firstElementChild;
  var top_bread = burger.firstElementChild;
  var bottom_bread = burger.lastElementChild;

  sidenav_trigger.addEventListener("click", function () {
    // sidenav_close_button.classList.toggle("hidden");
    if (sidenav.getAttribute("aria-expanded") == "false") {
      sidenav.setAttribute("aria-expanded", "true");
    } else {
      sidenav.setAttribute("aria-expanded", "false");
    }
    sidenav.classList.toggle("translate-x-0");
    sidenav.classList.toggle("ml-6");
    sidenav.classList.toggle("shadow-xl");
    sidenav.classList.toggle("z-1000");
  });
  sidenav_close_button.addEventListener("click", function () {
    sidenav_trigger.click();
  });

  window.addEventListener("click", function (e) {
    if (!sidenav.contains(e.target) && !sidenav_trigger.contains(e.target)) {
      if (sidenav.getAttribute("aria-expanded") == "true") {
        sidenav_trigger.click();
      }
    }
  });
}
