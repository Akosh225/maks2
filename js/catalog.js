/**
 * catalog.js
 * Логика страницы каталога: рендер карточек из CARS (data.js),
 * фильтрация по состоянию/марке/типу кузова/цене и модальное окно
 * быстрого просмотра. Зависит от data.js (переменная CARS) и
 * main.js (функция formatPrice) — подключать после них.
 */

const BODY_TYPE_LABELS = {
  sedan: "Седан",
  suv: "Внедорожник",
  hatchback: "Хэтчбек",
};

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return; // скрипт подключён не на странице каталога

  const conditionChips = document.querySelectorAll("[data-filter-condition]");
  const brandSelect = document.getElementById("filter-brand");
  const searchInput = document.getElementById("filter-search");
  const bodySelect = document.getElementById("filter-body");
  const priceMinInput = document.getElementById("filter-price-min");
  const priceMaxInput = document.getElementById("filter-price-max");
  const resetBtn = document.getElementById("filter-reset");
  const resultsCount = document.getElementById("results-count");
  const sortSelect = document.getElementById("sort-cars");
  const compareOpen = document.getElementById("compare-open");
  const compareCount = document.getElementById("compare-count");
  const compareModal = document.getElementById("compare-modal");
  const compareBody = document.getElementById("compare-body");
  const compareClose = document.getElementById("compare-close");

  const state = {
    condition: "all",
    brand: "all",
    search: "",
    bodyType: "all",
    priceMin: null,
    priceMax: null,
    sort: "default",
  };

  let compareIds = getStoredIds("auto-vesta-compare").slice(0, 3);

  populateBrandOptions();
  applyFiltersFromURL();
  render();

  conditionChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      conditionChips.forEach((c) => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      state.condition = chip.dataset.filterCondition;
      render();
    });
  });

  brandSelect.addEventListener("change", () => {
    state.brand = brandSelect.value;
    render();
  });

  searchInput.addEventListener("input", () => {
    state.search = searchInput.value.trim();
    render();
  });

  bodySelect.addEventListener("change", () => {
    state.bodyType = bodySelect.value;
    render();
  });

  priceMinInput.addEventListener("input", () => {
    state.priceMin = priceMinInput.value ? Number(priceMinInput.value) : null;
    render();
  });
  priceMaxInput.addEventListener("input", () => {
    state.priceMax = priceMaxInput.value ? Number(priceMaxInput.value) : null;
    render();
  });

  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    render();
  });

  resetBtn.addEventListener("click", () => {
    state.condition = "all";
    state.brand = "all";
    state.search = "";
    state.bodyType = "all";
    state.priceMin = null;
    state.priceMax = null;
    state.sort = "default";

    conditionChips.forEach((c) =>
      c.setAttribute("aria-pressed", c.dataset.filterCondition === "all" ? "true" : "false")
    );
    brandSelect.value = "all";
    searchInput.value = "";
    bodySelect.value = "all";
    priceMinInput.value = "";
    priceMaxInput.value = "";
    sortSelect.value = "default";
    render();
  });

  /** Если пришли из блока "Топ предложений" со ссылкой ?condition=new и т.п. */
  function applyFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    const condition = params.get("condition");
    if (condition && (condition === "new" || condition === "used")) {
      state.condition = condition;
      conditionChips.forEach((c) =>
        c.setAttribute(
          "aria-pressed",
          c.dataset.filterCondition === condition ? "true" : "false"
        )
      );
    }

    const brand = params.get("brand");
    if (brand && [...brandSelect.options].some((option) => option.value === brand)) {
      state.brand = brand;
      brandSelect.value = brand;
    }

    const bodyType = params.get("body");
    if (bodyType && [...bodySelect.options].some((option) => option.value === bodyType)) {
      state.bodyType = bodyType;
      bodySelect.value = bodyType;
    }

    const search = params.get("search");
    if (search) {
      state.search = search;
      searchInput.value = search;
    }

    const sort = params.get("sort");
    if ([...sortSelect.options].some((option) => option.value === sort)) {
      state.sort = sort;
      sortSelect.value = sort;
    }
  }

  function populateBrandOptions() {
    const brands = [...new Set(CARS.map((car) => car.brand))].sort();
    brands.forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });
  }

  function getFilteredCars() {
    if (state.priceMin !== null && state.priceMax !== null && state.priceMin > state.priceMax) {
      return [];
    }
    return CARS.filter((car) => {
      if (state.condition !== "all" && car.condition !== state.condition) return false;
      if (state.brand !== "all" && car.brand !== state.brand) return false;
      if (state.bodyType !== "all" && car.bodyType !== state.bodyType) return false;
      if (state.search) {
        const haystack = `${car.brand} ${car.model}`.toLocaleLowerCase("ru-RU");
        if (!haystack.includes(state.search.toLocaleLowerCase("ru-RU"))) return false;
      }
      if (state.priceMin !== null && car.price < state.priceMin) return false;
      if (state.priceMax !== null && car.price > state.priceMax) return false;
      return true;
    });
  }

  function render() {
    syncURL();
    const filtered = getFilteredCars();
    if (state.sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (state.sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (state.sort === "year-desc") filtered.sort((a, b) => b.year - a.year);
    grid.innerHTML = "";

    resultsCount.textContent = `Найдено автомобилей: ${filtered.length}`;

    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = state.priceMin !== null && state.priceMax !== null && state.priceMin > state.priceMax
        ? "Минимальная цена не может быть выше максимальной."
        : "По заданным фильтрам автомобили не найдены. Попробуйте изменить условия поиска.";
      grid.appendChild(empty);
      return;
    }

    filtered.forEach((car) => grid.appendChild(buildCarCard(car)));
    updateCompareButton();
  }

  function syncURL() {
    const params = new URLSearchParams();
    if (state.condition !== "all") params.set("condition", state.condition);
    if (state.brand !== "all") params.set("brand", state.brand);
    if (state.bodyType !== "all") params.set("body", state.bodyType);
    if (state.search) params.set("search", state.search);
    if (state.sort !== "default") params.set("sort", state.sort);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  function buildCarCard(car) {
    const card = document.createElement("article");
    card.className = "car-card";
    card.innerHTML = `
      <div class="car-card__media">
        <img src="${car.image}" alt="${car.brand} ${car.model}, ${car.year} год" loading="lazy" onerror="this.classList.add('image-fallback')">
        <span class="car-card__badge car-card__badge--${car.condition}">
          ${car.condition === "new" ? "Новый" : "С пробегом"}
        </span>
        <span class="car-card__price-tag">${formatPrice(car.price)}</span>
        <button type="button" class="favorite-btn" aria-label="Добавить ${car.brand} ${car.model} в избранное" aria-pressed="false">♡</button>
      </div>
      <div class="car-card__body">
        <h3 class="car-card__title">${car.brand} ${car.model}</h3>
        <div class="car-card__meta">
          <span>${car.year}</span>
          <span>${BODY_TYPE_LABELS[car.bodyType] || car.bodyType}</span>
          <span>${car.transmission}</span>
          ${car.condition === "used" ? `<span>${car.mileage.toLocaleString("ru-RU")} км</span>` : ""}
        </div>
        <div class="car-card__actions">
          <button type="button" class="btn btn--outline btn--sm car-card__quick-btn" data-car-id="${car.id}">
            Быстрый просмотр
          </button>
          <button type="button" class="btn btn--outline btn--sm compare-btn" aria-pressed="${compareIds.includes(car.id)}">${compareIds.includes(car.id) ? "В сравнении" : "Сравнить"}</button>
          <a href="car.html?id=${car.id}" class="btn btn--primary btn--sm">Подробнее</a>
        </div>
      </div>
    `;

    card
      .querySelector(".car-card__quick-btn")
      .addEventListener("click", () => openQuickView(car));

    const favoriteButton = card.querySelector(".favorite-btn");
    const favorites = getFavorites();
    const isFavorite = favorites.includes(car.id);
    favoriteButton.textContent = isFavorite ? "♥" : "♡";
    favoriteButton.setAttribute("aria-pressed", String(isFavorite));
    favoriteButton.classList.toggle("is-favorite", isFavorite);
    favoriteButton.addEventListener("click", () => {
      const nextFavorites = getFavorites();
      const index = nextFavorites.indexOf(car.id);
      if (index >= 0) nextFavorites.splice(index, 1);
      else nextFavorites.push(car.id);
      localStorage.setItem("auto-vesta-favorites", JSON.stringify(nextFavorites));
      const active = index < 0;
      favoriteButton.textContent = active ? "♥" : "♡";
      favoriteButton.setAttribute("aria-pressed", String(active));
      favoriteButton.classList.toggle("is-favorite", active);
    });

    card.querySelector(".compare-btn").addEventListener("click", (event) => {
      const index = compareIds.indexOf(car.id);
      if (index >= 0) {
        compareIds.splice(index, 1);
      } else if (compareIds.length < 3) {
        compareIds.push(car.id);
      } else {
        return;
      }
      localStorage.setItem("auto-vesta-compare", JSON.stringify(compareIds));
      event.currentTarget.textContent = compareIds.includes(car.id) ? "В сравнении" : "Сравнить";
      event.currentTarget.setAttribute("aria-pressed", String(compareIds.includes(car.id)));
      updateCompareButton();
    });

    return card;
  }

  function getFavorites() {
    return getStoredIds("auto-vesta-favorites");
  }

  function getStoredIds(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value.filter((id) => Number.isInteger(id)) : [];
    } catch (error) {
      return [];
    }
  }

  function updateCompareButton() {
    compareCount.textContent = String(compareIds.length);
    compareOpen.hidden = compareIds.length < 2;
  }

  function openCompare() {
    const cars = compareIds.map((id) => CARS.find((car) => car.id === id)).filter(Boolean);
    compareBody.innerHTML = `
      <h2>Сравнение автомобилей</h2>
      <div class="compare-table-wrap"><table class="compare-table">
        <thead><tr><th>Характеристика</th>${cars.map((car) => `<th>${car.brand} ${car.model}</th>`).join("")}</tr></thead>
        <tbody>
          ${[
            ["Цена", (car) => formatPrice(car.price)],
            ["Год", (car) => car.year],
            ["Кузов", (car) => BODY_TYPE_LABELS[car.bodyType] || car.bodyType],
            ["Двигатель", (car) => car.engine],
            ["Коробка", (car) => car.transmission],
            ["Привод", (car) => car.drive],
            ["Пробег", (car) => car.condition === "used" ? `${car.mileage.toLocaleString("ru-RU")} км` : "Новый"],
          ].map(([label, getter]) => `<tr><th>${label}</th>${cars.map((car) => `<td>${getter(car)}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table></div>
    `;
    compareModal.classList.add("is-open");
    compareModal.setAttribute("aria-hidden", "false");
    compareClose.focus();
    document.body.style.overflow = "hidden";
  }

  function closeCompare() {
    compareModal.classList.remove("is-open");
    compareModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ---------- Модальное окно быстрого просмотра ---------- */
  const modalOverlay = document.getElementById("quick-view-modal");
  const modalBody = modalOverlay.querySelector(".modal__body");
  const modalMediaImg = modalOverlay.querySelector(".modal__media img");
  const modalClose = modalOverlay.querySelector(".modal__close");
  let lastFocusedElement = null;

  function openQuickView(car) {
    lastFocusedElement = document.activeElement;
    modalMediaImg.src = car.image;
    modalMediaImg.alt = `${car.brand} ${car.model}`;

    modalBody.innerHTML = `
      <h3>${car.brand} ${car.model}, ${car.year}</h3>
      <p>${car.description}</p>
      <dl class="modal__specs">
        <dt>Цена</dt><dd>${formatPrice(car.price)}</dd>
        <dt>Состояние</dt><dd>${car.condition === "new" ? "Новый автомобиль" : "С пробегом"}</dd>
        <dt>Пробег</dt><dd>${car.condition === "used" ? car.mileage.toLocaleString("ru-RU") + " км" : "0 км"}</dd>
        <dt>Кузов</dt><dd>${BODY_TYPE_LABELS[car.bodyType] || car.bodyType}</dd>
        <dt>Двигатель</dt><dd>${car.engine}</dd>
        <dt>КПП</dt><dd>${car.transmission}</dd>
        <dt>Привод</dt><dd>${car.drive}</dd>
        <dt>Цвет</dt><dd>${car.color}</dd>
      </dl>
      <div class="modal__actions">
        <a href="car.html?id=${car.id}" class="btn btn--primary">Подробнее и запись на тест-драйв</a>
        <button type="button" class="btn btn--outline" data-modal-dismiss>Закрыть</button>
      </div>
    `;

    modalBody
      .querySelector("[data-modal-dismiss]")
      .addEventListener("click", closeQuickView);

    modalOverlay.classList.add("is-open");
    modalOverlay.setAttribute("aria-hidden", "false");
    modalClose.focus();
    document.body.style.overflow = "hidden";
  }

  function closeQuickView() {
    modalOverlay.classList.remove("is-open");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  modalClose.addEventListener("click", closeQuickView);
  compareOpen.addEventListener("click", openCompare);
  compareClose.addEventListener("click", closeCompare);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeQuickView();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("is-open")) {
      closeQuickView();
    }
    if (e.key === "Escape" && compareModal.classList.contains("is-open")) closeCompare();
  });
});
