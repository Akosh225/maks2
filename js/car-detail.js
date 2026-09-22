/**
 * car-detail.js
 * Логика страницы car.html: находит автомобиль по параметру ?id=
 * в URL, отрисовывает карточку товара, галерею, таблицу
 * характеристик, кредитный калькулятор и валидирует форму записи
 * на тест-драйв. Зависит от data.js, main.js и validation.js.
 */

const BODY_TYPE_LABELS_RU = {
  sedan: "Седан",
  suv: "Внедорожник",
  hatchback: "Хэтчбек",
};

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("car-detail-root");
  if (!root) return; // не на странице car.html

  const params = new URLSearchParams(window.location.search);
  const carId = Number(params.get("id"));
  const car = CARS.find((c) => c.id === carId);

  if (!car) {
    renderNotFound(root);
    return;
  }

  renderCar(car, root);
  initCalculator(car);
  initBookingForm(car);
});

function renderNotFound(root) {
  root.innerHTML = `
    <div class="empty-state">
      <h2>Автомобиль не найден</h2>
      <p>Возможно, ссылка устарела или объявление снято с продажи.</p>
      <a class="btn btn--primary" href="catalog.html">Вернуться в каталог</a>
    </div>
  `;
}

function renderCar(car, root) {
  document.title = `${car.brand} ${car.model} — AUTO-VESTA`;

  const images = [car.image, ...(car.gallery || [])];

  root.innerHTML = `
    <div class="car-detail__gallery">
      <img id="gallery-main-image" src="${images[0]}" alt="${car.brand} ${car.model}" onerror="this.classList.add('image-fallback')">
      <div class="car-detail__thumbs" role="list">
        ${images
          .map(
            (src, i) => `
            <img src="${src}" alt="Фото ${i + 1}" loading="lazy" class="${i === 0 ? "is-active" : ""}" data-thumb tabindex="0" role="listitem" onerror="this.classList.add('image-fallback')">
        `
          )
          .join("")}
      </div>
    </div>
    <div class="car-detail__info">
      <a class="back-link" href="catalog.html">&larr; Назад в каталог</a>
      <div class="car-detail__header">
        <div>
          <span class="car-card__badge car-card__badge--${car.condition}" style="position:static; display:inline-block; margin-bottom:8px;">
            ${car.condition === "new" ? "Новый автомобиль" : "С пробегом"}
          </span>
          <h1>${car.brand} ${car.model}</h1>
        </div>
        <div class="car-detail__price">${formatPrice(car.price)}</div>
      </div>
        <button type="button" class="btn btn--outline detail-favorite" aria-pressed="false">♡ Добавить в избранное</button>
      <p>${car.description}</p>
      <table class="spec-table">
        <tr><td>Год выпуска</td><td>${car.year}</td></tr>
        <tr><td>Кузов</td><td>${BODY_TYPE_LABELS_RU[car.bodyType] || car.bodyType}</td></tr>
        <tr><td>Пробег</td><td>${car.condition === "used" ? car.mileage.toLocaleString("ru-RU") + " км" : "0 км (новый)"}</td></tr>
        <tr><td>Двигатель</td><td>${car.engine}</td></tr>
        <tr><td>Топливо</td><td>${car.fuel}</td></tr>
        <tr><td>Коробка передач</td><td>${car.transmission}</td></tr>
        <tr><td>Привод</td><td>${car.drive}</td></tr>
        <tr><td>Цвет</td><td>${car.color}</td></tr>
      </table>
    </div>
  `;

  const mainImage = document.getElementById("gallery-main-image");
  root.querySelectorAll("[data-thumb]").forEach((thumb) => {
    const activate = () => {
      mainImage.src = thumb.src;
      root.querySelectorAll("[data-thumb]").forEach((t) => t.classList.remove("is-active"));
      thumb.classList.add("is-active");
    };
    thumb.addEventListener("click", activate);
    // Доступность: миниатюры должны переключаться и с клавиатуры (Enter/Space).
    thumb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });

  const favoriteButton = root.querySelector(".detail-favorite");
  const favoriteKey = "auto-vesta-favorites";
  let favorites = [];
  try { favorites = JSON.parse(localStorage.getItem(favoriteKey) || "[]"); } catch (error) { favorites = []; }
  const updateFavorite = () => {
    const active = favorites.includes(car.id);
    favoriteButton.textContent = active ? "♥ В избранном" : "♡ Добавить в избранное";
    favoriteButton.setAttribute("aria-pressed", String(active));
  };
  updateFavorite();
  favoriteButton.addEventListener("click", () => {
    const index = favorites.indexOf(car.id);
    if (index >= 0) favorites.splice(index, 1); else favorites.push(car.id);
    localStorage.setItem(favoriteKey, JSON.stringify(favorites));
    updateFavorite();
  });
}

/**
 * Кредитный калькулятор: считает ежемесячный платёж по формуле
 * аннуитетного платежа на основе цены авто, первоначального взноса,
 * срока (мес.) и годовой ставки.
 */
function initCalculator(car) {
  const form = document.getElementById("calculator-form");
  if (!form) return;

  const priceEl = document.getElementById("calc-price");
  priceEl.textContent = formatPrice(car.price);

  const downPaymentInput = form.elements["downPayment"];
  const termInput = form.elements["term"];
  const rateInput = form.elements["rate"];
  const resultValue = document.getElementById("calc-result-value");
  const resultPrincipal = document.getElementById("calc-result-principal");

  const dateInput = document.getElementById("booking-date");
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

  function calculate() {
    const downPaymentPercent = Number(downPaymentInput.value) || 0;
    const termMonths = Number(termInput.value) || 1;
    const annualRatePercent = Number(rateInput.value) || 0;

    const downPaymentAmount = car.price * (downPaymentPercent / 100);
    const principal = Math.max(car.price - downPaymentAmount, 0);
    const monthlyRate = annualRatePercent / 100 / 12;

    let monthlyPayment;
    if (monthlyRate === 0) {
      monthlyPayment = principal / termMonths;
    } else {
      // Формула аннуитетного платежа
      monthlyPayment =
        (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    }

    resultValue.textContent = formatPrice(Math.round(monthlyPayment));
    resultPrincipal.textContent = `Сумма кредита: ${formatPrice(Math.round(principal))}`;
  }

  form.addEventListener("input", calculate);
  calculate();
}

/** Настраивает валидацию формы записи на тест-драйв (использует validation.js). */
function initBookingForm(car) {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const carField = document.getElementById("booking-car-name");
  if (carField) carField.value = `${car.brand} ${car.model} (${car.year})`;

  setupFormValidation(
    form,
    {
      name: [Validators.required, Validators.minLength(2)],
      phone: [Validators.required, Validators.phone],
      email: [Validators.required, Validators.email],
      date: [Validators.required],
    },
    () => {
      // В учебном проекте реальная отправка не требуется —
      // просто показываем сообщение об успехе (см. validation.js).
    }
  );
}
