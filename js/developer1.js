(() => {
  "use strict";

  const header = document.querySelector("[data-d1-header]");
  const menuToggle = document.querySelector("[data-d1-menu-toggle]");
  const navigation = document.querySelector("[data-d1-navigation]");
  const mobileBreakpoint = window.matchMedia("(max-width: 900px)");

  if (header) {
    const updateHeader = () => {
      header.classList.toggle("d1-is-scrolled", window.scrollY > 16);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  if (menuToggle && navigation) {
    let lastFocusedElement = null;

    const getFocusableElements = () =>
      Array.from(
        navigation.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

    const openMenu = () => {
      lastFocusedElement = document.activeElement;
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Tutup menu navigasi");
      navigation.classList.add("d1-is-open");
      document.body.classList.add("d1-menu-open");
      getFocusableElements()[0]?.focus();
    };

    const closeMenu = ({ restoreFocus = true } = {}) => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Buka menu navigasi");
      navigation.classList.remove("d1-is-open");
      document.body.classList.remove("d1-menu-open");

      if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
      }
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a") && mobileBreakpoint.matches) {
        closeMenu({ restoreFocus: false });
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!navigation.classList.contains("d1-is-open")) return;

      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        menuToggle.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        menuToggle.focus();
      } else if (event.shiftKey && document.activeElement === menuToggle) {
        event.preventDefault();
        lastElement?.focus();
      }
    });

    mobileBreakpoint.addEventListener("change", (event) => {
      if (!event.matches) closeMenu({ restoreFocus: false });
    });
  }

  const revealElements = document.querySelectorAll("[data-d1-reveal]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("d1-is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("d1-is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
      observer.observe(element);
    });
  }
})();
