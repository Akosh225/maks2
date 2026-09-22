/**
 * validation.js
 * Небольшая переиспользуемая библиотека для клиентской валидации форм.
 * Используется формой записи на тест-драйв (car.html) и формой
 * обратной связи (contacts.html), поэтому вынесена отдельно от
 * конкретной логики страниц (принцип DRY).
 */

const Validators = {
  required(value) {
    return value.trim().length > 0 ? "" : "Это поле обязательно для заполнения";
  },
  minLength(min) {
    return (value) =>
      value.trim().length >= min ? "" : `Минимум ${min} символа(ов)`;
  },
  email(value) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value.trim()) ? "" : "Введите корректный email";
  },
  phone(value) {
    // Допускаем форматы: +7 777 123 45 67, 87771234567, +7(777)123-45-67 и т.п.
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 12
      ? ""
      : "Введите корректный номер телефона";
  },
};

/**
 * Проверяет одно поле по списку валидаторов и показывает/скрывает ошибку.
 * @param {HTMLElement} field - input/textarea/select
 * @param {Array<Function>} rules - функции-валидаторы, возвращающие "" при успехе
 * @returns {boolean} true, если поле валидно
 */
function validateField(field, rules) {
  const wrapper = field.closest(".field");
  const errorEl = wrapper ? wrapper.querySelector(".field__error") : null;
  let message = "";

  for (const rule of rules) {
    message = rule(field.value);
    if (message) break;
  }

  if (wrapper) wrapper.classList.toggle("has-error", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  if (errorEl) {
    errorEl.textContent = message;
    if (message) {
      if (!errorEl.id) errorEl.id = `${field.id}-error`;
      field.setAttribute("aria-describedby", errorEl.id);
    } else {
      field.removeAttribute("aria-describedby");
    }
  }

  return message === "";
}

/**
 * Настраивает форму: валидация при submit + "живая" перепроверка поля
 * при вводе после первой ошибки (чтобы не раздражать пользователя
 * ошибками до того, как он вообще начал печатать).
 *
 * @param {HTMLFormElement} form
 * @param {Object} schema - { fieldName: [Validators...] }
 * @param {Function} onSuccess - вызывается с FormData при успешной валидации
 */
function setupFormValidation(form, schema, onSuccess) {
  const statusEl = form.querySelector(".form-status");
  const consent = form.elements.consent;

  if (consent) {
    schema.consent = [
      (value) => consent.checked ? "" : "Необходимо подтвердить согласие",
    ];
  }

  Object.keys(schema).forEach((name) => {
    const field = form.elements[name];
    if (!field) return;
    field.addEventListener("input", () => {
      const wrapper = field.closest(".field");
      if (wrapper && wrapper.classList.contains("has-error")) {
        validateField(field, schema[name]);
      }
    });

    if (field.type === "tel") {
      field.addEventListener("input", () => {
        const digits = field.value.replace(/\D/g, "").slice(0, 11);
        const normalized = digits.startsWith("8") ? `7${digits.slice(1)}` : digits;
        const parts = normalized.match(/^7(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
        if (!parts) return;
        field.value = `+7${parts[1] ? ` (${parts[1]}` : ""}${parts[1]?.length === 3 ? ")" : ""}${parts[2] ? ` ${parts[2]}` : ""}${parts[3] ? `-${parts[3]}` : ""}${parts[4] ? `-${parts[4]}` : ""}`;
      });
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isFormValid = true;

    Object.keys(schema).forEach((name) => {
      const field = form.elements[name];
      if (!field) return;
      const valid = validateField(field, schema[name]);
      if (!valid) isFormValid = false;
    });

    if (statusEl) {
      statusEl.classList.remove("is-success", "is-error");
    }

    if (!isFormValid) {
      if (statusEl) {
        statusEl.textContent = "Пожалуйста, исправьте отмеченные поля выше.";
        statusEl.classList.add("is-error");
      }
      return;
    }

    // Реальная отправка на сервер не требуется по ТЗ — имитируем успех.
    if (statusEl) {
      statusEl.textContent =
        "Заявка отправлена! Наш менеджер свяжется с вами в ближайшее время.";
      statusEl.classList.add("is-success");
      statusEl.setAttribute("tabindex", "-1");
      statusEl.focus();
    }

    if (typeof onSuccess === "function") {
      onSuccess(new FormData(form));
    }

    form.reset();
  });
}
