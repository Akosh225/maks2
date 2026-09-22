/**
 * slider.js
 * Простой слайдер для hero-блока главной страницы: автопрокрутка,
 * стрелки вперёд/назад, кликабельные точки-индикаторы.
 * Работает только с DOM, который уже отрисован в index.html —
 * данные не подгружает из data.js, т.к. это витринный баннер,
 * а не список товаров.
 */

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider");
  if (!slider) return;

  const track = slider.querySelector(".slider__track");
  const slides = Array.from(slider.querySelectorAll(".slider__slide"));
  const dotsContainer = slider.querySelector(".slider__dots");
  const prevBtn = slider.querySelector(".slider__arrow--prev");
  const nextBtn = slider.querySelector(".slider__arrow--next");

  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 5000;

  // Генерируем точки-индикаторы динамически, чтобы их количество
  // всегда совпадало с количеством слайдов в разметке.
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "slider__dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Слайд ${index + 1}`);
    if (index === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll(".slider__dot"));

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) =>
      dot.classList.toggle("is-active", i === currentIndex)
    );
    restartAutoplay();
  }

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), AUTOPLAY_DELAY);
  }

  prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

  // Останавливаем автопрокрутку, пока пользователь наводит курсор —
  // иначе слайд может смениться прямо во время чтения текста.
  slider.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
  slider.addEventListener("mouseleave", restartAutoplay);

  restartAutoplay();
});
