/**
 * main.js
 * Общая логика AUTO-VESTA:
 *  - мобильное меню (гамбургер и кнопка "Назад")
 *  - подсветка активного пункта навигации
 *  - форматирование цены в тенге
 *  - текущий год в футере
 *  - обработка ошибок загрузки картинок
 */

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₸";
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  highlightActiveNavLink();
  setFooterYear();
  enhanceImages();
});

function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const navClose = document.querySelector(".nav__close");

  if (!toggle || !nav) return;

  // Функция для закрытия меню
  const closeMenu = () => {
    nav.classList.remove("nav--open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Открыть меню");
    document.body.style.overflow = "";
  };

  // Переключение по кнопке-гамбургеру
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Закрытие по кнопке «Назад»
  if (navClose) {
    navClose.addEventListener("click", closeMenu);
  }

  // Закрытие при клике на любую ссылку в меню
  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Автоматическое закрытие при расширении экрана до ПК-версии (>= 768px)
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && nav.classList.contains("nav--open")) {
      closeMenu();
    }
  });

  // Закрытие при нажатии на клавишу Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("nav--open")) {
      closeMenu();
    }
  });
}

function enhanceImages() {
  document.querySelectorAll("img").forEach((image) => {
    if (!image.closest(".hero__media")) {
      image.loading = "lazy";
    }
    image.addEventListener(
        "error",
        () => {
          image.classList.add("image-fallback");
          image.alt = `${image.alt || "Изображение"} (недоступно)`;
        },
        { once: true }
    );
  });
}

function highlightActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__link").forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function setFooterYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}