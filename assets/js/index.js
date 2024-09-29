// SELECTORS
const hamburger = document.querySelector(".hamburger");
const bar = document.querySelectorAll(".bar");
const navMenu = document.querySelector(".nav-menu");
const sovaImg = document.querySelectorAll(".valo-img, .valo-img-cropped");

/*===== SCROLL REVEAL =====*/
const sr = ScrollReveal({
    origin: "bottom",
    distance: "200px",
    duration: 2000,
});

// EVENT ------------------------------------------------------>

// Header
sr.reveal(".text-overlay", { origin: "center" });
sr.reveal(".valo-img-container", { distance: "200px", reset: false });
sr.reveal("#agent-name", {});
sr.reveal(".desc-container", {});

// Abilities
sr.reveal(".skill-container h1", { origin: "left" });
sr.reveal(".abilities-ico", { origin: "left" });
sr.reveal(".abilities-text", { origin: "left" });

// Agents Reveal
sr.reveal(".other-agents h1", { origin: "left" });
sr.reveal(".agent", { delay: 500 });
sr.reveal(".play-now", {});

// Add event listener to hamburger bar
hamburger.addEventListener("click", mobileMenu);

// Add class to give animation
function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    bar.forEach((el) => {
        el.classList.toggle("active");
    });
}

// Make hamburger menu closed once we clicked a link
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

// Give sova image animation
if (sovaImg.length > 0) {
    sovaImg.forEach(sovaImg => {
        window.addEventListener("scroll", () => {
            let value = window.scrollY;
            sovaImg.style.top = value * -0.05 + "px";

            if (value > 250) {
                sovaImg.style.top = -.50 + "px";
            }
            if (value === 0) {
                sovaImg.style.top = 10 + "px";
            }
        });
    });
} else {
    console.error("No elements with the specified classes found.");
}


// FUNCTION ----------------------------------------------------->
function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    bar.forEach((el) => {
        el.classList.remove("active");
    });
}






