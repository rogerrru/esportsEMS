// SELECTORS
const sovaImg = document.querySelectorAll(".valo-img, .valo-img-cropped");

/*===== SCROLL REVEAL =====*/
const sr = ScrollReveal({
    origin: "bottom",
    distance: "200px",
    duration: 2000,
});

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

// Parallax scroll for hero agent image
if (sovaImg.length > 0) {
    sovaImg.forEach(img => {
        window.addEventListener("scroll", () => {
            const value = window.scrollY;
            img.style.top = value > 250 ? "-0.5px" : `${value * -0.05}px`;
        }, { passive: true });
    });
}






