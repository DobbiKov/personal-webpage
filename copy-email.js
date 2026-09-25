/*
 * Copy-to-clipboard buttons next to the email addresses in Contact Me.
 * mailto: does nothing for visitors without a mail client, so this gives
 * them the address directly. The button flips to "Copied" for a moment and
 * a polite live region announces it to screen readers.
 */
(function () {
    const buttons = Array.from(document.querySelectorAll("[data-copy]"));
    if (!buttons.length) return;

    const status = document.querySelector("[data-copy-status]");
    const RESET_MS = 2000;
    const COPY_KEYS = /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘C" : "Ctrl+C";

    // Hidden textarea + execCommand: works on plain http and in browsers
    // (or embedded views) that refuse the async Clipboard API.
    function legacyCopy(text) {
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        let ok = false;
        try {
            ok = document.execCommand("copy");
        } catch (error) {
            ok = false;
        }
        area.remove();
        return ok;
    }

    function copy(text) {
        const fallback = () =>
            legacyCopy(text) ? Promise.resolve() : Promise.reject(new Error("copy failed"));
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).catch(fallback);
        }
        return fallback();
    }

    // Last resort: highlight the address so copying is one keystroke away.
    function selectAddress(button) {
        const link = button.closest(".contact-item")?.querySelector("a[href^='mailto:']");
        if (!link) return;
        const range = document.createRange();
        range.selectNodeContents(link);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function show(button, state, text, announce) {
        const label = button.querySelector("[data-copy-label]");
        button.dataset.state = state;
        if (label) label.textContent = text;
        if (status) status.textContent = announce || "";
    }

    buttons.forEach((button) => {
        let timer = null;

        button.addEventListener("click", () => {
            const address = button.dataset.copy;
            copy(address)
                .then(() => show(button, "done", "Copied", `${address} copied to clipboard`))
                .catch(() => {
                    selectAddress(button);
                    show(button, "error", `Press ${COPY_KEYS}`, "Could not copy automatically; the address is selected");
                })
                .finally(() => {
                    clearTimeout(timer);
                    timer = setTimeout(() => show(button, "idle", "Copy"), RESET_MS);
                });
        });
    });
})();
