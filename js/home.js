/**
 * home.js
 * Отрисовывает блок "Топ предложений" на главной странице —
 * несколько карточек из общего массива CARS (data.js), чтобы данные
 * об автомобилях не дублировались в двух местах (принцип DRY).
 */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("top-offers-grid");
  if (!grid) return;

  const FEATURED_IDS = [1, 8, 2, 12]; // подобранная витрина: новые + топовый б/у

  const featured = FEATURED_IDS.map((id) => CARS.find((car) => car.id === id)).filter(
    Boolean
  );

  featured.forEach((car) => {
    const card = document.createElement("article");
    card.className = "car-card";
    card.innerHTML = `
      <div class="car-card__media">
        <img src="${car.image}" alt="${car.brand} ${car.model}, ${car.year} год" loading="lazy" onerror="this.classList.add('image-fallback')">
        <span class="car-card__badge car-card__badge--${car.condition}">
          ${car.condition === "new" ? "Новый" : "С пробегом"}
        </span>
        <span class="car-card__price-tag">${formatPrice(car.price)}</span>
      </div>
      <div class="car-card__body">
        <h3 class="car-card__title">${car.brand} ${car.model}</h3>
        <div class="car-card__meta">
          <span>${car.year}</span>
          <span>${car.transmission}</span>
          <span>${car.engine}</span>
        </div>
        <div class="car-card__actions">
          <a href="car.html?id=${car.id}" class="btn btn--primary btn--sm btn--block">Подробнее</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
});
