// Visible sur : toutes les pages (menu rétractable)

document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("menuOpen");
    const closeBtn = document.getElementById("menuClose");
    const drawer = document.getElementById("mobileMenu");
    const overlay = document.getElementById("menuOverlay");

    if (!openBtn || !closeBtn || !drawer || !overlay) return;

    let lastFocus = null;

    function openMenu() {
        lastFocus = document.activeElement;

        drawer.classList.add("is-open");
        overlay.hidden = false;
        overlay.classList.add("is-open");

        drawer.setAttribute("aria-hidden", "false");
        openBtn.setAttribute("aria-expanded", "true");

        document.body.classList.add("no-scroll");
        closeBtn.focus();
    }

    function closeMenu() {
        drawer.classList.remove("is-open");
        overlay.classList.remove("is-open");

        drawer.setAttribute("aria-hidden", "true");
        openBtn.setAttribute("aria-expanded", "false");

        document.body.classList.remove("no-scroll");

        setTimeout(() => overlay.hidden = true, 250);
        if (lastFocus) lastFocus.focus();
    }

    openBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && drawer.classList.contains("is-open")) {
            closeMenu();
        }
    });
});
 