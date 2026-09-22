/**
 * contact.js
 * Подключает валидацию (из validation.js) к форме обратной связи
 * на странице контактов.
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  setupFormValidation(form, {
    name: [Validators.required, Validators.minLength(2)],
    email: [Validators.required, Validators.email],
    phone: [Validators.required, Validators.phone],
    message: [Validators.required, Validators.minLength(10)],
  });
});
