// Menu rétractable + carrousel + accordéon
// URL maquette / interactions visibles : https://www.figma.com/design/H1ua9fJ9e8ueeFOn9Pa1D3/SAE-105?node-id=1-185&t=BT9xAHf7C1gurE3V-1

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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

    // Carrousel horizontal
    const carousel = document.querySelector("[data-carousel]");
    if (carousel) {
        const track = carousel.querySelector("[data-carousel-track]");
        const prev = carousel.querySelector("[data-carousel-prev]");
        const next = carousel.querySelector("[data-carousel-next]");
        const items = Array.from(carousel.querySelectorAll(".carousel__item"));

        const scrollToItem = (index) => {
            const clamped = clamp(index, 0, items.length - 1);
            const target = items[clamped];
            if (target) {
                target.scrollIntoView({ behavior: "smooth", inline: "start" });
                carousel.dataset.activeIndex = clamped;
            }
        };

        carousel.dataset.activeIndex = 0;

        prev?.addEventListener("click", () => {
            const current = Number(carousel.dataset.activeIndex || 0);
            scrollToItem(current - 1);
        });

        next?.addEventListener("click", () => {
            const current = Number(carousel.dataset.activeIndex || 0);
            scrollToItem(current + 1);
        });

        track?.addEventListener("scroll", () => {
            const scrollLeft = track.scrollLeft;
            const itemWidth = items[0]?.getBoundingClientRect().width || 1;
            const idx = Math.round(scrollLeft / (itemWidth + 12)); // 12px gap
            carousel.dataset.activeIndex = clamp(idx, 0, items.length - 1);
        });
    }

    // Accordéon (FAQs)
    const accordions = document.querySelectorAll("[data-accordion]");
    accordions.forEach((accordion) => {
        const items = accordion.querySelectorAll(".accordion__item");
        items.forEach((item) => {
            const btn = item.querySelector(".accordion__button");
            const panel = item.querySelector(".accordion__panel");
            if (!btn || !panel) return;

            btn.addEventListener("click", () => {
                const isOpen = item.classList.toggle("is-open");
                btn.setAttribute("aria-expanded", String(isOpen));
            });
        });
    });
});
 