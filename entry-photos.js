/*
 * Entry photos — touch behaviour.
 *
 * Desktop (hover-capable) devices reveal the enlarged preview purely via CSS
 * :hover / :focus-within. Touch devices have no reliable tap-to-focus on a
 * <span>, so here we toggle an `.is-open` class on tap, which the stylesheet
 * turns into a centered lightbox. Tapping outside, the close cue, another
 * entry, or pressing Escape all dismiss it.
 */
(function () {
    const items = Array.from(document.querySelectorAll(".entry-photo"));
    if (!items.length) return;

    const coarse = window.matchMedia("(hover: none)");
    let openEl = null;

    function close() {
        if (!openEl) return;
        openEl.classList.remove("is-open");
        openEl = null;
        document.body.classList.remove("entry-photo-lock");
    }

    function open(el) {
        if (openEl && openEl !== el) openEl.classList.remove("is-open");
        loadFull(el);
        el.classList.add("is-open");
        openEl = el;
        if (coarse.matches) document.body.classList.add("entry-photo-lock");
    }

    function toggle(el) {
        if (el.classList.contains("is-open")) close();
        else open(el);
    }

    // The page ships only the small thumbnails; the full-size preview is
    // fetched the first time an entry is hovered, focused or opened. It stays
    // transparent until fully decoded so it never shows half-downloaded.
    function loadFull(el) {
        const img = el.querySelector(".entry-photo-pop img[data-src]");
        if (!img) return;
        img.addEventListener("load", () => img.classList.add("is-loaded"), {
            once: true,
        });
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
    }

    items.forEach((el) => {
        // Mouse/keyboard only: on touch, iOS treats a DOM change during the
        // emulated hover as "hover content" and swallows the first tap.
        el.addEventListener("pointerenter", (e) => {
            if (e.pointerType === "mouse") loadFull(el);
        });
        el.addEventListener("focusin", () => {
            if (!coarse.matches) loadFull(el);
        });

        el.addEventListener("click", (e) => {
            // Hover-capable devices use the CSS :hover reveal; leave them alone.
            if (!coarse.matches) return;
            e.preventDefault();
            e.stopPropagation();
            toggle(el);
        });

        el.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(el);
            } else if (e.key === "Escape") {
                close();
            }
        });
    });

    // A tap that lands outside the enlarged photo closes the lightbox. Taps on
    // the dim backdrop register on the entry element and are handled above.
    document.addEventListener("click", (e) => {
        if (!openEl) return;
        if (!e.target.closest(".entry-photo-pop")) close();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
    });

    // If a device switches away from touch (e.g. tablet + mouse), tidy up.
    coarse.addEventListener("change", (e) => {
        if (!e.matches) close();
    });
})();
