const body = document.body;
const header = document.querySelector("[data-site-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const kernels = document.querySelectorAll("[data-depth]");

function updateHeaderState() {
  if (!header) return;

  if (window.scrollY > 12) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
}

function updateKernelParallax() {
  if (!kernels.length) return;

  const scrollY = window.scrollY;

  kernels.forEach((kernel) => {
    const depth = Number(kernel.dataset.depth || 0.12);
    const y = scrollY * depth;
    kernel.style.translate = `0 ${y}px`;
  });
}

function closeMobileMenu() {
  body.classList.remove("menu-open");

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
  }
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (siteNav) {
  siteNav.addEventListener("click", (event) => {
    const clickedLink = event.target.closest("a");

    if (clickedLink) {
      closeMobileMenu();
    }
  });
}

window.addEventListener(
  "scroll",
  () => {
    updateHeaderState();
    updateKernelParallax();
  },
  { passive: true }
);

updateHeaderState();
updateKernelParallax();

const revealItems = document.querySelectorAll(".reveal-on-scroll");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();
    closeMobileMenu();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

/* Home/shop flavor carousel */

const flavorTrack = document.querySelector("[data-flavor-track]");
const flavorPrev = document.querySelector("[data-flavor-prev]");
const flavorNext = document.querySelector("[data-flavor-next]");

function getFlavorScrollAmount() {
  if (!flavorTrack) return 0;

  const firstTile = flavorTrack.querySelector(".flavor-tile");

  if (!firstTile) return flavorTrack.clientWidth;

  const styles = window.getComputedStyle(flavorTrack);
  const gap = parseFloat(styles.columnGap || styles.gap || 18);

  return firstTile.getBoundingClientRect().width + gap;
}

if (flavorTrack && flavorPrev && flavorNext) {
  flavorPrev.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    flavorTrack.scrollBy({
      left: -getFlavorScrollAmount(),
      behavior: "smooth",
    });
  });

  flavorNext.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    flavorTrack.scrollBy({
      left: getFlavorScrollAmount(),
      behavior: "smooth",
    });
  });
}

/* Cart builder carousel */

const cartBuilderTrack = document.querySelector("[data-cart-builder-track]");
const cartBuilderPrev = document.querySelector("[data-cart-builder-prev]");
const cartBuilderNext = document.querySelector("[data-cart-builder-next]");

function getCartBuilderScrollAmount() {
  if (!cartBuilderTrack) return 0;

  const firstCard = cartBuilderTrack.querySelector(".cart-builder-flavor");

  if (!firstCard) return cartBuilderTrack.clientWidth;

  const styles = window.getComputedStyle(cartBuilderTrack);
  const gap = parseFloat(styles.columnGap || styles.gap || 12);

  return firstCard.getBoundingClientRect().width + gap;
}

function scrollCartBuilder(direction) {
  if (!cartBuilderTrack) return;

  cartBuilderTrack.scrollBy({
    left: direction * getCartBuilderScrollAmount(),
    behavior: "smooth",
  });
}

function handleCartBuilderArrow(event, direction) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();

    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }
  }

  scrollCartBuilder(direction);
}

function bindCartBuilderArrow(button, direction) {
  if (!button) return;

  let handledByPointer = false;

  button.addEventListener(
    "pointerdown",
    (event) => {
      handledByPointer = true;
      handleCartBuilderArrow(event, direction);

      window.setTimeout(() => {
        handledByPointer = false;
      }, 400);
    },
    { passive: false }
  );

  button.addEventListener("click", (event) => {
    if (handledByPointer) {
      event.preventDefault();
      event.stopPropagation();

      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }

      return;
    }

    handleCartBuilderArrow(event, direction);
  });
}

bindCartBuilderArrow(cartBuilderPrev, -1);
bindCartBuilderArrow(cartBuilderNext, 1);

/* Email offer popup + cookie banner */

const promoModal = document.querySelector("[data-promo-modal]");
const promoCloseButtons = document.querySelectorAll("[data-promo-close]");
const promoForm = document.querySelector("[data-promo-form]");
const promoSuccess = document.querySelector("[data-promo-success]");

const cookieBanner = document.querySelector("[data-cookie-banner]");
const cookieAccept = document.querySelector("[data-cookie-accept]");
const cookieDecline = document.querySelector("[data-cookie-decline]");

const promoStorageKey = "chachas_promo_modal_status";
const cookieStorageKey = "chachas_cookie_consent";

function openPromoModal() {
  if (!promoModal) return;
  if (localStorage.getItem(promoStorageKey)) return;

  promoModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closePromoModal(status = "dismissed") {
  if (!promoModal) return;

  promoModal.hidden = true;
  document.body.classList.remove("modal-open");
  localStorage.setItem(promoStorageKey, status);
}

function showCookieBanner() {
  if (!cookieBanner) return;
  if (localStorage.getItem(cookieStorageKey)) return;

  cookieBanner.hidden = false;
}

function setCookiePreference(value) {
  if (!cookieBanner) return;

  localStorage.setItem(cookieStorageKey, value);
  cookieBanner.hidden = true;
}

window.addEventListener("load", () => {
  showCookieBanner();

  window.setTimeout(() => {
    openPromoModal();
  }, 1400);
});

promoCloseButtons.forEach((button) => {
  button.addEventListener("click", () => closePromoModal("dismissed"));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && promoModal && !promoModal.hidden) {
    closePromoModal("dismissed");
  }
});

if (promoForm) {
  promoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (promoSuccess) {
      promoSuccess.hidden = false;
    }

    localStorage.setItem(promoStorageKey, "submitted");

    window.setTimeout(() => {
      closePromoModal("submitted");
    }, 1600);
  });
}

if (cookieAccept) {
  cookieAccept.addEventListener("click", () => setCookiePreference("accepted"));
}

if (cookieDecline) {
  cookieDecline.addEventListener("click", () => setCookiePreference("declined"));
}