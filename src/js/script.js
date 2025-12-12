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

    // Carrousels horizontaux (multi)
    const carousels = document.querySelectorAll("[data-carousel]");
    carousels.forEach((carousel) => {
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
            const gap = 12;
            const idx = Math.round(scrollLeft / (itemWidth + gap));
            carousel.dataset.activeIndex = clamp(idx, 0, items.length - 1);
        });
    });

    // Accordéon (FAQs)
    const accordions = document.querySelectorAll("[data-accordion]");
    accordions.forEach((accordion) => {
        const items = accordion.querySelectorAll(".accordion__item");
        items.forEach((item) => {
            // prefer the new toggle button, fall back to old full-button
            const btn = item.querySelector(".accordion__toggle") || item.querySelector(".accordion__button");
            const panel = item.querySelector(".accordion__panel");
            if (!btn || !panel) return;

            // Ensure panel is hidden initially for assistive technologies
            const isOpenInit = item.classList.contains('is-open');
            panel.setAttribute('aria-hidden', String(!isOpenInit));

            // Ensure panel has an id and set aria-controls on the toggle for accessibility
            if (!panel.id) {
                panel.id = 'accordion-panel-' + Math.random().toString(36).slice(2, 9);
            }
            btn.setAttribute('aria-controls', panel.id);

            btn.addEventListener("click", (e) => {
                const isOpen = item.classList.toggle("is-open");
                btn.setAttribute("aria-expanded", String(isOpen));
                // set proper aria-hidden for the panel so screen readers hide it when closed
                panel.setAttribute('aria-hidden', String(!isOpen));
                // rotate the icon when open
                btn.classList.toggle('is-open', isOpen);
                e.stopPropagation();
            });
        });
    });

    // Contact form handling (client-side only)
    const contactForm = document.getElementById('contactForm');
    const contactState = document.getElementById('contactFormState');
    if (contactForm && contactState) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('#name');
            const email = contactForm.querySelector('#email');
            const message = contactForm.querySelector('#message');

            // Simple validation
            if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
                contactState.style.display = 'block';
                contactState.textContent = 'Veuillez remplir les champs obligatoires.';
                return;
            }

            // Success (stub) — in a real site we'd POST to an endpoint
            contactState.style.display = 'block';
            contactState.textContent = 'Message envoyé — merci, nous vous répondrons bientôt.';
            contactForm.reset();
        });
    }
});
