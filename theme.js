(() => {
  const THEME_KEY = "dobbikov-theme";
  const LIGHT_THEME_COLOR = "#2a5d8f";
  const DARK_THEME_COLOR = "#10161d";
  const MOBILE_NAV_QUERY = "(max-width: 650px)";
  const root = document.documentElement;
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const mobileNavMedia = window.matchMedia(MOBILE_NAV_QUERY);

  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const getStoredTheme = () => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      return savedTheme === "dark" || savedTheme === "light" ? savedTheme : null;
    } catch (error) {
      return null;
    }
  };

  const getCurrentTheme = () => {
    const attrTheme = root.getAttribute("data-theme");
    if (attrTheme === "dark" || attrTheme === "light") {
      return attrTheme;
    }
    return getStoredTheme() || getSystemTheme();
  };

  const updateThemeColor = (theme) => {
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme === "dark" ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
    }
  };

  const updateToggleButtons = (theme) => {
    const isDark = theme === "dark";
    const label = isDark ? "Switch to light theme" : "Switch to dark theme";

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-label", label);
      button.setAttribute("aria-pressed", String(isDark));

      const icon = button.querySelector("[data-theme-icon]");
      if (icon) {
        icon.classList.toggle("fa-sun", isDark);
        icon.classList.toggle("fa-moon", !isDark);
      }

      const labelSpan = button.querySelector("[data-theme-toggle-label]");
      if (labelSpan) {
        labelSpan.textContent = label;
      }
    });
  };

  const applyTheme = (theme, persist) => {
    root.setAttribute("data-theme", theme);
    updateThemeColor(theme);
    updateToggleButtons(theme);

    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (error) {
        // Ignore storage errors.
      }
    }
  };

  const initializeThemeToggle = () => {
    const initialTheme = getCurrentTheme();
    applyTheme(initialTheme, false);

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
        applyTheme(nextTheme, true);
      });
    });
  };

  const initializeNavigationToggle = () => {
    const navRoots = Array.from(document.querySelectorAll(".main_cont_routs"));
    if (!navRoots.length) {
      return;
    }

    const setNavOpen = (nav, isOpen) => {
      const toggle = nav.querySelector("[data-nav-toggle]");
      if (!toggle) {
        return;
      }

      nav.setAttribute("data-menu-open", String(isOpen));
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");

      const icon = toggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen);
      }
    };

    const closeAllNavMenus = () => {
      navRoots.forEach((nav) => setNavOpen(nav, false));
    };

    navRoots.forEach((nav) => {
      const toggle = nav.querySelector("[data-nav-toggle]");
      const menu = nav.querySelector("[data-nav-menu]");
      if (!toggle || !menu) {
        return;
      }

      setNavOpen(nav, false);

      toggle.addEventListener("click", () => {
        const isOpen = nav.getAttribute("data-menu-open") === "true";
        closeAllNavMenus();
        setNavOpen(nav, !isOpen);
      });

      menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          closeAllNavMenus();
        });
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAllNavMenus();
      }
    });

    mobileNavMedia.addEventListener("change", (event) => {
      if (!event.matches) {
        closeAllNavMenus();
      }
    });
  };

  const initializeStickyHeader = () => {
    const heroNav = document.getElementById('hero-nav');
    const siteHeader = document.getElementById('site-header');
    if (!heroNav || !siteHeader) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        siteHeader.classList.toggle('is-visible', !entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(heroNav);
  };

  const initializeIndexSectionTracking = () => {
    const heroNav = document.getElementById('hero-nav');
    const siteHeader = document.getElementById('site-header');
    if (!heroNav || !siteHeader) return;

    // Map each section id to the href used in nav links
    const sectionDefs = [
      { id: 'home', isBrand: true },
      { id: 'about', href: '#about' },
      { id: 'contact', href: '#contact' },
    ];

    const sectionEls = sectionDefs
      .map((def) => ({ ...def, el: document.getElementById(def.id) }))
      .filter((def) => def.el);

    const allNavRoots = [heroNav, siteHeader];

    const setActive = (activeId) => {
      allNavRoots.forEach((nav) => {
        nav.querySelectorAll('.main_header_a').forEach((link) => {
          const isBrand = link.classList.contains('main_brand');
          const href = link.getAttribute('href');
          const def = sectionEls.find((d) => d.id === activeId);
          const isActive = def
            ? def.isBrand
              ? isBrand
              : href === def.href
            : false;

          link.classList.toggle('main_cont_routs_active', isActive);
          if (isActive) {
            link.setAttribute('aria-current', 'page');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    };

    const update = () => {
      const markerY = window.scrollY + window.innerHeight * 0.34;
      let activeId = sectionEls[0]?.id;

      sectionEls.forEach(({ id, el }) => {
        const sectionTop = el.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= markerY) {
          activeId = id;
        }
      });

      setActive(activeId);
    };

    const sectionObserver = new IntersectionObserver(update, {
      threshold: [0, 0.2, 0.4, 0.8],
      rootMargin: '-20% 0px -55% 0px',
    });

    sectionEls.forEach(({ el }) => sectionObserver.observe(el));

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  };

  initializeThemeToggle();
  initializeNavigationToggle();
  initializeStickyHeader();
  initializeIndexSectionTracking();
})();
